import { EventEmitter } from 'events';
import { DatasetType } from './app';
import { TrackedObject } from './TrackedObject';
import { ApiResponse, RawMeasurement } from '@bosch/api-interfaces';
import { Deduplicator } from './Deduplicator';

export class Simulation extends EventEmitter {
  private static instance: Simulation;
  private dataset: DatasetType = DatasetType.DATASET_1;
  public currentTimestamp = 0;
  private data: RawMeasurement[] = [];
  private playing = false;
  private playbackSpeed = 1;
  private length = 0;
  public bufferTimestamp = 0;
  public trackedObjects: TrackedObject[] = [];
  private animationFrame?: number;
  private lastTime = 0;
  private frame = 0;
  private lastTimestamp = 0;
  private firstFrame = 999999999999;
  public uniqueTrackings = 0;
  private deduplicator: Deduplicator;
  public leftBlindSpot: TrackedObject[] = [];
  public rightBlindSpot: TrackedObject[] = [];
  public carSpeed = 0;
  public carX = 0;
  public carY = 0;
  private carChangeTimestamp = 0;
  private pausedAt = 0;
  private pausedTime = 0;

  public blindSpotDetection() {
    const rightBlindSpot = this.trackedObjects.filter(
      (o) => o.x < 3.6 && o.x > -0.8 && o.y < -0.1 && o.y > -4.5
    );
    const leftBlindSpot = this.trackedObjects.filter(
      (o) => o.x < 3.6 && o.x > -0.8 && o.y > 0.1 && o.y < 4.5
    );
    if (leftBlindSpot.length > 0 && this.leftBlindSpot.length === 0) {
      this.leftBlindSpot = leftBlindSpot;
      this.emit('blindSpotChange');
    } else if (leftBlindSpot.length === 0 && this.leftBlindSpot.length > 0) {
      this.leftBlindSpot = [];
      this.emit('blindSpotChange');
    }
    if (rightBlindSpot.length > 0 && this.rightBlindSpot.length === 0) {
      this.rightBlindSpot = rightBlindSpot;
      this.emit('blindSpotChange');
    } else if (rightBlindSpot.length === 0 && this.rightBlindSpot.length > 0) {
      this.rightBlindSpot = [];
      this.emit('blindSpotChange');
    }
  }

  constructor() {
    super();
    this.deduplicator = new Deduplicator();
  }

  static get() {
    if (!this.instance) {
      this.instance = new Simulation();
    }
    return this.instance;
  }

  private removeTrackedObject(uuid: string): void {
    this.trackedObjects = this.trackedObjects.filter((o) => o.uuid !== uuid);
  }

  public changeDataset(dataset: DatasetType) {
    this.dataset = dataset;
    this.data = [];
    this.reset();
    this.loadDataset();
  }

  private reset() {
    this.firstFrame = 999999999999;
    this.uniqueTrackings = 0;
    this.currentTimestamp = 0;
    this.frame = 0;
    this.bufferTimestamp = 0;
    this.pausedAt = 0;
    this.pausedTime = 0;
    this.trackedObjects = [];
    this.emit('step');
  }

  private loadDataset() {
    this.loadDatasetInfo();
    this.loadChunk();
    setInterval(() => {
      this.ensureBufferIsHealthy();
    }, 1000);
  }

  private updatePredictions(timestamp: number) {
    this.trackedObjects.forEach((trackedObject) => {
      trackedObject.predict(timestamp);
    });
    this.trackedObjects = this.trackedObjects.filter(
      (trackedObject) => trackedObject.ttl > 0
    );
  }

  private async loadChunk() {
    try {
      const response = await fetch(
        'https://anton.sch.bme.hu/api/data?dataset=' +
          this.dataset +
          '&cursor=' +
          this.bufferTimestamp
      );
      const data: ApiResponse = await response.json();
      this.data = this.data.concat(
        data.data.map((d) => ({ ...d, consumed: false }))
      );
      this.bufferTimestamp = data.data[data.data.length - 1].timestamp;
      this.emit('chunkLoaded');
    } catch (e) {
      console.error('Loading error', e);
      this.emit('loadingError');
    }
  }

  togglePlaying() {
    this.playing = !this.playing;
    this.emit('playingChanged', this.playing);
    if (this.playing) {
      this.play();
    } else {
      this.pausedAt = new Date().getTime();
      if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    }
  }

  changePlaybackSpeed(speed: number) {
    this.playbackSpeed = speed;
    this.emit('playbackSpeedChanged', this.playbackSpeed);
  }

  private async loadDatasetInfo() {
    try {
      const response = await fetch(
        `https://anton.sch.bme.hu/api/info?dataset=${this.dataset}`
      );
      const data: { length: number; lastTimestamp: number } =
        await response.json();
      this.length = data.length;
      this.lastTimestamp = data.lastTimestamp;
      this.emit('lengthChanged', data.length);
    } catch (e) {
      console.error('Loading error', e);
      this.emit('loadingError');
    }
  }

  private ensureBufferIsHealthy() {
    const bufferLength = this.data.filter((d) => !d.consumed).length;
    if (bufferLength < 30000 && this.bufferTimestamp < this.lastTimestamp) {
      this.loadChunk();
    }
  }

  private play() {
    this.animationFrame = requestAnimationFrame(this.step);
  }

  private step = (time: number) => {
    this.pausedTime += this.pausedAt ? new Date().getTime() - this.pausedAt : 0;
    this.pausedAt = 0;
    this.firstFrame = Math.min(time, this.firstFrame);
    const timestamp =
      ((time - this.firstFrame - this.pausedAt - this.pausedTime) / 10) *
      this.playbackSpeed;
    this.frame++;
    this.lastTime = time;
    this.currentTimestamp = timestamp;
    const pendingMeasurements = this.data.filter(
      (item) => item.timestamp < timestamp && !item.consumed
    );
    if (pendingMeasurements[0]?.car) {
      this.carSpeed = Math.sqrt(
        pendingMeasurements[0].car.vx ** 2 + pendingMeasurements[0].car.vy ** 2
      );
      const dt =
        (pendingMeasurements[0].timestamp - this.carChangeTimestamp) / 100;
      this.carX = this.carX + pendingMeasurements[0].car.vx * dt;
      this.carY = this.carY + pendingMeasurements[0].car.vy * dt;
      this.carChangeTimestamp = pendingMeasurements[0].timestamp;
    }
    this.updatePredictions(timestamp);
    const deduped = pendingMeasurements.map(this.deduplicator.deduplicate);
    deduped.forEach((dedupRow) => {
      const newTrackedObjects: TrackedObject[] = [];
      dedupRow.forEach((measurement) => {
        const existing = this.trackedObjects.filter((trackedObject) =>
          trackedObject.compare(measurement)
        );
        existing.sort((a, b) => b.measurements.length - a.measurements.length);
        const bestMatch = existing[0];
        if (bestMatch) {
          bestMatch.addMeasurement(measurement, timestamp);
          /*existing
            .filter((e) => e.uuid !== bestMatch.uuid)
            .forEach((e) => this.removeTrackedObject(e.uuid));*/
        } else {
          if (Math.abs(measurement.y) < 8 && (measurement.z ?? 0) < 1.25) {
            this.uniqueTrackings += 1;
            const to = new TrackedObject();
            to.addMeasurement(measurement, timestamp);
            newTrackedObjects.push(to);
          }
        }
      });
      this.trackedObjects = this.trackedObjects.concat(newTrackedObjects);
    });
    this.blindSpotDetection();
    pendingMeasurements.forEach((item) => {
      item.consumed = true;
    });
    this.emit('step');
    this.animationFrame = requestAnimationFrame(this.step);
  };
}
