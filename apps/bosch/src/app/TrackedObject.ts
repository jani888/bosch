import { HistoryItem } from './components/View3D';
import { NormalizedObjectData, RawObjectType } from '@bosch/api-interfaces';
import { Condition, ConditionChecker } from './ConditionChecker';

export const MAX_TTL = 300;

export class TrackedObject {
  public ttl = MAX_TTL;
  public history: HistoryItem[] = [];
  public measurements: HistoryItem[] = [];
  public predictions: HistoryItem[] = [];
  public uuid = Math.random().toString(36).substring(7);
  public x = 0;
  public y = 0;
  public z = 0;
  public type: RawObjectType = RawObjectType.NO_DETECTION;
  public prediction = { x: 0, y: 0 };

  /**
   * Returns the similarity score with a measurement. (0-1)
   */
  compare(other: NormalizedObjectData): boolean {
    const checker = new ConditionChecker();
    const dx = this.prediction.x - other.x;
    const dy = this.prediction.y - other.y;
    const d2 = dx * dx + dy * dy;

    if (this.z > 0.5 && (other.z ?? 0) > 0.5) {
      return Math.sqrt(d2) < Math.max(this.z, 2);
    }
    checker.addCondition(new Condition('dx', this.prediction.x, other.x, 1.5));
    checker.addCondition(new Condition('dy', this.prediction.y, other.y, 0.75));
    if (
      this.type !== RawObjectType.NO_DETECTION &&
      other.objectType &&
      other.objectType !== RawObjectType.NO_DETECTION &&
      other.objectType !== RawObjectType.CAR_OR_TRUCK &&
      this.type !== RawObjectType.CAR_OR_TRUCK
    ) {
      checker.addCondition(
        new Condition('type', this.type, other.objectType, 0)
      );
    }
    checker.addCondition(
      new Condition('vx', this.lastMeasurement().vx, other.vx, 1.5)
    );
    checker.addCondition(
      new Condition('vx', this.lastMeasurement().vy, other.vy, 0.75)
    );
    return checker.checkConditions(1);
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
    this.ttl = MAX_TTL;
    this.x = measurement.x;
    this.y = measurement.y;
    this.z = measurement.z || this.z;
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
      (lastMeasurement.timestamp !== measurement.timestamp &&
        (lastMeasurement.x !== measurement.x ||
          lastMeasurement.y !== measurement.y))
    ) {
      this.history.push({
        ...measurement,
        actualTimestamp,
        itemType: 'measurement',
      });
      const movingAverage = this.measurements.slice(-15).reduce(
        (acc, cur) => {
          return {
            count: acc.count + 1,
            vx: acc.vx + cur.vx,
            vy: acc.vy + cur.vy,
          };
        },
        { vx: 0, vy: 0, count: 0 }
      );
      movingAverage.vx += measurement.vx;
      movingAverage.vy += measurement.vy;
      movingAverage.vx /= movingAverage.count + 1;
      movingAverage.vy /= movingAverage.count + 1;

      this.measurements.push({
        ...measurement,
        //vx: movingAverage.vx,
        //vy: movingAverage.vy,
        actualTimestamp,
        itemType: 'measurement',
      });
    }
  }

  lastMeasurement(): HistoryItem {
    return this.measurements[this.measurements.length - 1];
  }

  predict(timestamp: number) {
    this.ttl = MAX_TTL - (timestamp - this.lastMeasurement().timestamp);
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
