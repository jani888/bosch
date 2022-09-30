import React, { ReactElement } from 'react';
import { Canvas } from '@react-three/fiber';
import { UnknownObject } from './3d/objects/UnknownObject';
import { BasePlane } from './BasePlane';
import { Lights } from './Lights';
import { Controls } from './Controls';
import { ACESFilmicToneMapping, Fog, sRGBEncoding, Vector3 } from 'three';
import { Environment } from '@react-three/drei';
import { TrackedObject } from '../simulation';
import { Pedestrian, PedestrianMovementState } from './3d/objects/Pedestrian';
import { Cyclist } from './3d/objects/Cyclist';
import { Car } from './3d/objects/Car/Car';

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

export function View3D({
  data,
  selected,
}: {
  data: TrackedObject[];
  selected: string;
}): ReactElement {
  return (
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

        {data.map((trackedObject) => (
          <TrackedObjectItem
            selected={trackedObject.uuid === selected}
            key={trackedObject.uuid}
            object={trackedObject}
          />
        ))}
        <UnknownObject x={5} y={0} />
        <Pedestrian
          x={0}
          y={10}
          heading={90}
          movementState={PedestrianMovementState.Idle}
        />
        <Cyclist x={0} y={0} heading={45} color={'red'} opacity={0.5} />

        <BasePlane />
        <Controls />
      </scene>
    </Canvas>
  );
}

function History3D({
  component,
  history,
}: {
  component: ReactElement;
  history: HistoryItem[];
}) {
  return (
    <>
      {history.map((historyItem, index) => (
        <group key={index} position={[historyItem.x, 0, historyItem.y]}>
          {React.cloneElement(component, {
            color: historyItem.itemType === 'measurement' ? 'red' : 'blue',
            opacity: (index + 1) / (history.length + 1),
          })}
        </group>
      ))}
    </>
  );
}

function TrackedObjectItem({
  object,
  selected,
}: {
  object: TrackedObject;
  selected: boolean;
}) {
  if (object.type === ObjectType.Pedestrian) {
    return (
      <>
        {selected && (
          <History3D
            component={
              <Pedestrian
                heading={360}
                movementState={PedestrianMovementState.Idle}
                x={0}
                y={0}
                color="blue"
              />
            }
            history={object.history}
          />
        )}
        <Pedestrian
          x={object.x}
          y={object.y}
          heading={360}
          movementState={PedestrianMovementState.Walking}
          color={selected ? 'blue' : 'grey'}
        />
      </>
    );
  }
  if (object.type === ObjectType.Unknown) {
    const origin = new Vector3(object.x, 1, object.y);
    const target = new Vector3(object.prediction.x, 1, object.prediction.y);
    const directionVector = target.sub(origin);

    return (
      <>
        {/*<UnknownObject
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
        />*/}
        {selected && (
          <History3D
            component={<UnknownObject x={0} y={0} color="blue" />}
            history={object.history}
          />
        )}
        <UnknownObject
          color={selected ? 'blue' : 'grey'}
          x={object.x}
          y={object.y}
          opacity={object.ttl / 100}
        />
      </>
    );
  }
  return null;
}
