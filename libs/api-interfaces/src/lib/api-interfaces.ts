export interface RawMeasurement {
  consumed: boolean;
  timestamp: number;
  objects: RawObjectData[];
}

export enum SensorType {
  CAMERA = 'camera',
  RADAR = 'radar',
}

export interface RawObjectData {
  sensorType: SensorType;
  sensorId?: number;
  x: number;
  y: number;
  z?: number;
  vx: number;
  vy: number;
  ax?: number;
  ay?: number;
  obstacleProbability?: number;
  objectType?: RawObjectType;
}

export interface NormalizedObjectData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z?: number;
  ax?: number;
  ay?: number;
  obstacleProbability?: number;
  objectType?: number;
  raw: RawObjectData[];
  timestamp: number;
}

export type ApiResponse = {
  data: RawMeasurement[];
};

export enum RawObjectType {
  NO_DETECTION = 0,
  TRUCK = 1,
  CAR = 2,
  MOTORBIKE = 3,
  BICYCLE = 4,
  PEDESTRIAN = 5,
  CAR_OR_TRUCK = 6,
}
