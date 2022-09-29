import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { UnknownObject } from './3d/objects/UnknownObject';
import { BasePlane } from './BasePlane';
import { Lights } from './Lights';
import { Controls } from './Controls';
import { Stack } from '@mui/material';
import { ACESFilmicToneMapping, Fog, sRGBEncoding, Vector3 } from 'three';
import { ObjectList } from './object-list/ObjectList';
import { Environment } from '@react-three/drei';
import { Car } from './3d/objects/Car/Car';
import { Pedestrian, PedestrianMovementState } from './3d/objects/Pedestrian';

export enum ObjectType {
  Unknown = 'Unknown',
  Pedestrian = 'Pedestrian',
  Cyclist = 'Cyclist',
  Car = 'Car',
}

export interface NormalizedMeasurement {
  x: number;
  y: number;
  type?: ObjectType;
}

export interface HistoryItem {
  timestamp: number;
  x: number;
  y: number;
  objectType?: ObjectType;
  confidence?: number;
  itemType: 'measurement' | 'prediction';
}

export class TrackedObject {
  public ttl = 100;
  protected history: HistoryItem[] = [];
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
    if (measurement.type === ObjectType.Unknown) {
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
    /*this.history.push({
      timestamp: this.history[this.history.length - 1].timestamp + dt2,
      x,
      y,
      confidence: 0.7,
      itemType: 'prediction',
    });*/
    this.prediction = { x, y };
  }
}

let trackedObjects: TrackedObject[] = [];

function updateTracking(measurement: NormalizedMeasurement, dt: number) {
  console.log('New measurement', measurement);
  const bestMatch = trackedObjects
    .map((trackedObject) => ({
      trackedObject,
      similarity: trackedObject.compare(measurement),
    }))
    .sort((a, b) => b.similarity - a.similarity)[0];
  console.log('Best match', bestMatch);
  if (bestMatch?.similarity > 0.5) {
    bestMatch.trackedObject.addMeasurement(dt, measurement);
  } else {
    console.log("Couldn't find a match, creating new object");
    const trackedObject = new TrackedObject();
    trackedObject.addMeasurement(0, measurement);
    trackedObjects.push(trackedObject);
  }

  console.log('Tracked objects', trackedObjects);
}

let lastTimestamp = 0;
function simulate(time: number) {
  window.requestAnimationFrame(simulate);
  const dt = time - lastTimestamp;
  lastTimestamp = time;
  step(dt);
}

function updatePredictions(dt: number) {
  trackedObjects.forEach((trackedObject) => {
    trackedObject.predict(dt);
  });
  trackedObjects = trackedObjects.filter(
    (trackedObject) => trackedObject.ttl > 0
  );
}

function step(dt: number) {
  updatePredictions(dt);
  if (Math.random() < 0.3) {
    const measurement: NormalizedMeasurement = {
      x: Math.random() * 10,
      y: Math.random() * 10,
      type: ObjectType.Unknown,
    };
    updateTracking(measurement, dt);
  }
}

//window.requestAnimationFrame(simulate);

function useTrackedObjectList() {
  const [trackedObjectList, setTrackedObjectList] = useState<TrackedObject[]>(
    []
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackedObjectList(JSON.parse(JSON.stringify(trackedObjects)));
    }, 16);
    return () => clearInterval(interval);
  }, []);
  return trackedObjectList;
}

export function View3D() {
  //const trackedObjectList = useTrackedObjectList();
  const trackedObjectList: any[] = [];

  return (
    <Stack sx={{ height: '100%' }} direction="row">
      <Canvas
        style={{ height: '100%', width: '100%' }}
        shadows={true}
        gl={{
          antialias: true,
          outputEncoding: sRGBEncoding,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 0.85,
          pixelRatio: window.devicePixelRatio,
        }}
      >
        <scene fog={new Fog(0x333333, 10, 15)}>
          <Environment
            background={true} // Whether to affect scene.background
            files={'assets/venice_sunset_1k.hdr'}
            path={'/'}
          />

          <Lights />

          {trackedObjectList.map((trackedObject) => (
            <TrackedObjectItem
              key={trackedObject.uuid}
              object={trackedObject}
            />
          ))}
          <UnknownObject x={5} y={0} />
          <Car heading={45} x={5} y={5} />
          <Pedestrian
            x={0}
            y={-5}
            heading={45}
            movementState={PedestrianMovementState.Walking}
          />

          <BasePlane />
          <Controls />
        </scene>
      </Canvas>
      <ObjectList data={trackedObjectList} />
    </Stack>
  );
}

function TrackedObjectItem({ object }: { object: TrackedObject }) {
  if (object.type === ObjectType.Unknown) {
    const origin = new Vector3(object.x, 1, object.y);
    const target = new Vector3(object.prediction.x, 1, object.prediction.y);
    const directionVector = target.sub(origin);

    return (
      <>
        <UnknownObject
          x={object.prediction.x}
          y={object.prediction.y}
          color="red"
        />
        <arrowHelper
          args={[
            directionVector.normalize(),
            origin,
            Math.sqrt(
              Math.pow(object.x - object.prediction.x, 2) +
                Math.pow(object.y - object.prediction.y, 2)
            ),
            0xff00ff,
            0.5,
            0.6,
          ]}
        />
        <UnknownObject x={object.x} y={object.y} opacity={object.ttl / 100} />
      </>
    );
  }
  return null;
}
