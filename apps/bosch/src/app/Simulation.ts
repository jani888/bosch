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

  public changeDataset(dataset: DatasetType) {
    this.dataset = dataset;
    this.data = [];
    this.reset();
    this.loadDataset();
  }

  private reset() {
    this.uniqueTrackings = 0;
    this.currentTimestamp = 0;
    this.frame = 0;
    this.bufferTimestamp = 0;
  }

  private loadDataset() {
    this.loadDatasetInfo();
    this.loadChunk();
    setInterval(() => {
      this.ensureBufferIsHealthy();
    }, 5000);
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
        '/api/data?dataset=' + this.dataset + '&cursor=' + this.bufferTimestamp
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
      if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    }
  }

  changePlaybackSpeed(speed: number) {
    this.playbackSpeed = speed;
    this.emit('playbackSpeedChanged', this.playbackSpeed);
  }

  private async loadDatasetInfo() {
    try {
      const response = await fetch('/api/info?dataset=' + this.dataset);
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
    if (bufferLength < 300 && this.bufferTimestamp < this.lastTimestamp) {
      this.loadChunk();
    }
  }

  private play() {
    this.animationFrame = requestAnimationFrame(this.step);
  }

  private step = (time: number) => {
    this.firstFrame = Math.min(time, this.firstFrame);
    const timestamp = ((time - this.firstFrame) / 10) * this.playbackSpeed;
    this.frame++;
    this.lastTime = time;
    this.currentTimestamp = timestamp;
    const pendingMeasurements = this.data.filter(
      (item) => item.timestamp < timestamp && !item.consumed
    );
    this.updatePredictions(timestamp);
    const deduped = pendingMeasurements.map(this.deduplicator.deduplicate);
    deduped.forEach((dedupRow) => {
      const newTrackedObjects: TrackedObject[] = [];
      dedupRow.forEach((measurement) => {
        const existing = this.trackedObjects.find((trackedObject) =>
          trackedObject.compare(measurement)
        );
        if (existing) {
          existing.addMeasurement(measurement, timestamp);
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
    pendingMeasurements.forEach((item) => {
      item.consumed = true;
    });
    if (this.frame % 5 === 0) {
      this.emit('step');
    }
    this.animationFrame = requestAnimationFrame(this.step);
  };
}
