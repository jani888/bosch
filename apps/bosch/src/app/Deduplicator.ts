import {
  NormalizedObjectData,
  RawMeasurement,
  RawObjectData,
} from '@bosch/api-interfaces';
import { Condition, ConditionChecker } from './ConditionChecker';

export class Deduplicator {
  public deduplicate = (data: RawMeasurement): NormalizedObjectData[] => {
    const deduplicated: NormalizedObjectData[] = [];
    const rawObjects = data.objects.filter(
      (o) => Math.abs(o.x) < 50 && Math.abs(o.y) < 50
    );
    rawObjects.forEach((object) => {
      const existing = deduplicated.find((deduplicatedObject, index) =>
        this.isTheSameObject(deduplicatedObject, object)
      );
      if (existing) {
        if (!existing.ax) {
          existing.ax = object.ax;
        }
        if (!existing.ay) {
          existing.ay = object.ay;
        }
        if (!existing.objectType) {
          existing.objectType = object.objectType;
        }
        existing.raw.push(object);
        //TODO: update dedup result
      } else {
        deduplicated.push({
          timestamp: data.timestamp,
          ...object,
          raw: [object],
        });
      }
    });
    return deduplicated.filter(
      (o) => Math.sqrt(Math.pow(o.x, 2) + Math.pow(o.y, 2)) > 4
    );
  };

  private isTheSameObject = (
    deduplicatedObject: NormalizedObjectData,
    object: RawObjectData
  ): boolean => {
    const checker = new ConditionChecker();
    checker.addCondition(
      new Condition('x', deduplicatedObject.x, object.x, 1.5)
    );
    checker.addCondition(
      new Condition('y', deduplicatedObject.y, object.y, 0.75)
    );
    checker.addCondition(
      new Condition('vx', deduplicatedObject.vx, object.vx, 1.5)
    );
    checker.addCondition(
      new Condition('vy', deduplicatedObject.vy, object.vy, 0.75)
    );
    return checker.checkConditions();
  };
}
