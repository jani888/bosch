export class Condition {
  constructor(
    public name: string,
    public a: number,
    public b: number,
    public threshold: number
  ) {}

  public check() {
    return Math.abs(this.a - this.b) < this.threshold;
  }
}

export class ConditionChecker {
  private conditions: Condition[] = [];

  public addCondition(condition: Condition) {
    this.conditions.push(condition);
  }

  public checkConditions(maxFails = 1): boolean {
    return (
      this.conditions.map((condition) => condition.check()).filter((x) => !x)
        .length <= maxFails
    );
  }
}
