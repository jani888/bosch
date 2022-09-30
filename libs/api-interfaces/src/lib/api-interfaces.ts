export interface RawMeasurement {
  consumed: boolean;
  timestamp: number;
  a: number;
  b: number;
}

export type ApiResponse = {
  data: RawMeasurement[];
};
