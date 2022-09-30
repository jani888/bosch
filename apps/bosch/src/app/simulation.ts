import {
  HistoryItem,
  NormalizedMeasurement,
  ObjectType,
} from './components/View3D';

export let trackedObjects: TrackedObject[] = [];

export interface RawMeasurement {
  consumed: boolean;
  timestamp: number;
  a: number;
  b: number;
}

const data: RawMeasurement[] = [{ a: 1, b: 2, consumed: false, timestamp: 0 }];

function normalizeMeasurement(item: RawMeasurement): NormalizedMeasurement {
  return {
    x: Math.random() * 10,
    y: Math.random() * 10,
    type: ObjectType.Pedestrian,
  };
}

export function step(
  dt: number,
  timestamp: number,
  data: RawMeasurement[],
  invalidate: (timestamp: number[]) => void
) {
  updatePredictions(dt);
  const pendingMeasurements = data.filter(
    (item) => item.timestamp <= timestamp && !item.consumed
  );
  const normalizedMeasurements = pendingMeasurements.map(normalizeMeasurement);
  normalizedMeasurements.forEach((measurement) =>
    updateTracking(measurement, dt)
  );
  invalidate(pendingMeasurements.map((item) => item.timestamp));
}

function updateTracking(measurement: NormalizedMeasurement, dt: number) {
  const bestMatch = trackedObjects
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
    trackedObjects.push(trackedObject);
  }
}

function updatePredictions(dt: number) {
  trackedObjects.forEach((trackedObject) => {
    trackedObject.predict(dt);
  });
  trackedObjects = trackedObjects.filter(
    (trackedObject) => trackedObject.ttl > 0
  );
}

export class TrackedObject {
  public ttl = 100;
  public history: HistoryItem[] = [];
  public predictions: HistoryItem[] = [];
  public uuid = Math.random().toString(36).substring(7);
  public x = 0;
  public y = 0;
  public type: ObjectType = ObjectType.Unknown;
  public prediction = { x: 0, y: 0 };
  /**
   * Returns the similarity score with a measurement. (0-1)
   */
  compare(other: NormalizedMeasurement): number {
    const dx = this.prediction.x - other.x;
    const dy = this.prediction.y - other.y;
    const d2 = dx * dx + dy * dy;
    return 1 / (d2 / 20);
  }

  addMeasurement(dt: number, measurement: NormalizedMeasurement) {
    this.ttl = 100;
    this.x = measurement.x;
    this.y = measurement.y;
    if (this.type === ObjectType.Unknown && measurement.type) {
      this.type = measurement.type;
    }
    this.history.push({
      timestamp:
        this.history.length > 0
          ? this.history[this.history.length - 1].timestamp + dt
          : 0,
      x: measurement.x,
      y: measurement.y,
      confidence: 1,
      itemType: 'measurement',
    });
  }

  predict(dt2: number) {
    this.ttl--;
    if (this.history.length < 2) {
      this.prediction.x = this.x;
      this.prediction.y = this.y;
      return;
    }
    const dx =
      this.history[this.history.length - 1].x -
      this.history[this.history.length - 2].x;
    const dy =
      this.history[this.history.length - 1].y -
      this.history[this.history.length - 2].y;
    const dt =
      this.history[this.history.length - 1].timestamp -
      this.history[this.history.length - 2].timestamp;
    const vx = dx / dt;
    const vy = dy / dt;
    const x = this.history[this.history.length - 1].x + vx * dt2;
    const y = this.history[this.history.length - 1].y + vy * dt2;
    this.history.push({
      timestamp: this.history[this.history.length - 1].timestamp + dt2,
      x,
      y,
      confidence: 0.7,
      itemType: 'prediction',
    });
    this.predictions.push({
      timestamp: this.history[this.history.length - 1].timestamp + dt2,
      x,
      y,
      confidence: 0.7,
      itemType: 'prediction',
    });
    this.prediction = { x, y };
  }
}
