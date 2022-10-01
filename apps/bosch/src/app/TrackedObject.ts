import { HistoryItem } from './components/View3D';
import { NormalizedObjectData, RawObjectType } from '@bosch/api-interfaces';

export class TrackedObject {
  public ttl = 100;
  public history: HistoryItem[] = [];
  public measurements: HistoryItem[] = [];
  public predictions: HistoryItem[] = [];
  public uuid = Math.random().toString(36).substring(7);
  public x = 0;
  public y = 0;
  public type: RawObjectType = RawObjectType.NO_DETECTION;
  public prediction = { x: 0, y: 0 };

  /**
   * Returns the similarity score with a measurement. (0-1)
   */
  compare(other: NormalizedObjectData): number {
    const dx = this.prediction.x - other.x;
    const dy = this.prediction.y - other.y;
    const d2 = dx * dx + dy * dy;

    return Math.sqrt(d2) < 0.8 ? 1 : 0;
    /*if (other.x === this.x && other.y === this.y) {
      return 9999999;
    }
    const dx = this.prediction.x - other.x;
    const dy = this.prediction.y - other.y;
    const d2 = dx * dx + dy * dy;
    const d =
      Math.sqrt(
        this.prediction.x * this.prediction.x +
          this.prediction.y * this.prediction.y
      ) / 1.75;
    return (1 / (1 + d2)) * (1 + d / 100);*/
  }

  addMeasurement(measurement: NormalizedObjectData, actualTimestamp: number) {
    this.ttl = 100;
    this.x = measurement.x;
    this.y = measurement.y;
    if (this.prediction.x === 0 && this.prediction.y === 0) {
      this.prediction.x = this.x;
      this.prediction.y = this.y;
    }
    if (
      measurement.objectType &&
      measurement.objectType !== RawObjectType.NO_DETECTION
    ) {
      this.type = measurement.objectType;
    }
    const lastMeasurement = this.lastMeasurement();
    if (
      !lastMeasurement ||
      lastMeasurement.x !== measurement.x ||
      lastMeasurement.y !== measurement.y
    ) {
      this.history.push({
        ...measurement,
        actualTimestamp,
        itemType: 'measurement',
      });
      this.measurements.push({
        ...measurement,
        actualTimestamp,
        itemType: 'measurement',
      });
    }
  }

  lastMeasurement(): HistoryItem {
    return this.measurements[this.measurements.length - 1];
  }

  predict(timestamp: number) {
    this.ttl = 100 - (timestamp - this.lastMeasurement().timestamp);
    const dt = (timestamp - this.lastMeasurement().timestamp) / 100;
    const ax = this.lastMeasurement().ax || this.calculateAx();
    const ay = this.lastMeasurement().ay || this.calculateAy();
    const x =
      this.lastMeasurement().vx * dt +
      this.lastMeasurement().x +
      (ax / 2) * dt * dt;
    const y =
      this.lastMeasurement().vy * dt +
      this.lastMeasurement().y +
      (ay / 2) * dt * dt;
    const prediction = {
      x,
      y,
    };
    this.prediction = prediction;
    this.history.push({
      timestamp,
      actualTimestamp: timestamp,
      x,
      y,
      vx: this.lastMeasurement().vx + ax * dt,
      vy: this.lastMeasurement().vy + ay * dt,
      raw: [],
      itemType: 'prediction',
    });
  }

  private calculateAx() {
    if (this.measurements.length < 2) {
      return 0;
    }
    const dt =
      (this.lastMeasurement().timestamp -
        this.measurements[this.measurements.length - 2].timestamp) /
      100;
    return (
      (this.lastMeasurement().vx -
        this.measurements[this.measurements.length - 2].vx) /
      dt
    );
  }

  private calculateAy() {
    if (this.measurements.length < 2) {
      return 0;
    }
    const dt =
      (this.lastMeasurement().timestamp -
        this.measurements[this.measurements.length - 2].timestamp) /
      100;
    return (
      (this.lastMeasurement().vy -
        this.measurements[this.measurements.length - 2].vy) /
      dt
    );
  }
}
