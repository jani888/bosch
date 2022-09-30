import { NormalizedMeasurement, ObjectType } from './components/View3D';
import { EventEmitter } from 'events';
import { DatasetType } from './app';
import { TrackedObject } from './TrackedObject';

export interface RawMeasurement {
  consumed: boolean;
  timestamp: number;
  a: number;
  b: number;
}

type ApiResponse = {
  data: RawMeasurement[];
};

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
  private currentChunk = 0;
  private totalChunks = 0;
  private animationFrame?: number;
  private lastTime = 0;
  private frame = 0;

  static get() {
    if (!this.instance) {
      this.instance = new Simulation();
    }
    return this.instance;
  }

  private normalizeMeasurement = (
    item: RawMeasurement
  ): NormalizedMeasurement => {
    return {
      x: Math.random() * 10,
      y: Math.random() * 10,
      type: ObjectType.Pedestrian,
    };
  };

  public changeDataset(dataset: DatasetType) {
    this.dataset = dataset;
    this.loadDataset();
    this.reset();
  }

  private reset() {
    this.currentTimestamp = 0;
    this.frame = 0;
  }

  private loadDataset() {
    this.loadDatasetInfo();
    this.loadChunk(0);
    setInterval(() => {
      this.ensureBufferIsHealthy();
    }, 5000);
  }

  private updateTracking(measurement: NormalizedMeasurement, dt: number) {
    const bestMatch = this.trackedObjects
      .map((trackedObject) => ({
        trackedObject,
        similarity: trackedObject.compare(measurement),
      }))
      .sort((a, b) => b.similarity - a.similarity)[0];
    if (bestMatch?.similarity > 0.5) {
      bestMatch.trackedObject.addMeasurement(dt, measurement);
    } else {
      const trackedObject = new TrackedObject();
      trackedObject.addMeasurement(0, measurement);
      this.trackedObjects.push(trackedObject);
    }
  }

  private updatePredictions(dt: number) {
    this.trackedObjects.forEach((trackedObject) => {
      trackedObject.predict(dt);
    });
    this.trackedObjects = this.trackedObjects.filter(
      (trackedObject) => trackedObject.ttl > 0
    );
  }

  private async loadChunk(number: number) {
    try {
      const response = await fetch(
        '/api/data?dataset=' + this.dataset + '&chunk=' + number
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
      const data: { length: number; totalChunks: number } =
        await response.json();
      this.length = data.length;
      this.totalChunks = data.totalChunks;
      this.emit('lengthChanged', data.length);
    } catch (e) {
      console.error('Loading error', e);
      this.emit('loadingError');
    }
  }

  private ensureBufferIsHealthy() {
    const bufferLength = this.data.filter((d) => d.consumed).length;
    if (bufferLength < 1000 && this.currentChunk < this.totalChunks) {
      this.currentChunk++;
      this.loadChunk(this.currentChunk);
    }
  }

  private play() {
    this.animationFrame = requestAnimationFrame(this.step);
  }

  private step = (time: number) => {
    this.animationFrame = requestAnimationFrame(this.step);
    const dt = time - this.lastTime;
    this.frame++;
    this.emit('step', dt);
    this.lastTime = time;
    this.currentTimestamp += dt * this.playbackSpeed;
    this.trackedObjects = [];
    this.trackedObjects.push(new TrackedObject());
    this.trackedObjects.push(new TrackedObject());
    this.trackedObjects.push(new TrackedObject());
    this.trackedObjects.push(new TrackedObject());
    this.trackedObjects.push(new TrackedObject());
    this.trackedObjects.push(new TrackedObject());
    this.trackedObjects.push(new TrackedObject());
    this.trackedObjects.push(new TrackedObject());
    this.trackedObjects.push(new TrackedObject());
    this.trackedObjects.push(new TrackedObject());
    for (let i = 0; i < 10; i++) {
      this.trackedObjects[i].type =
        Math.random() > 0.5 ? ObjectType.Pedestrian : ObjectType.Cyclist;
      this.trackedObjects[i].x = Math.random() * 10;
      this.trackedObjects[i].y = Math.random() * 10;
      this.trackedObjects[i].uuid = 'test' + i;
    }
    this.updatePredictions(dt);
    const pendingMeasurements = this.data.filter(
      (item) => item.timestamp <= this.currentTimestamp && !item.consumed
    );
    const normalizedMeasurements = pendingMeasurements.map(
      this.normalizeMeasurement
    );
    normalizedMeasurements.forEach((measurement) =>
      this.updateTracking(measurement, dt)
    );
  };
}
