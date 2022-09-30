import {
  HistoryItem,
  NormalizedMeasurement,
  ObjectType,
} from './components/View3D';

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