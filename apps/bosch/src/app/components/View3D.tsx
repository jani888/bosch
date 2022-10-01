import React, { ReactElement, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { UnknownObject } from './3d/objects/UnknownObject';
import { BasePlane } from './BasePlane';
import { Lights } from './Lights';
import { Controls } from './Controls';
import { ACESFilmicToneMapping, sRGBEncoding, Vector3 } from 'three';
import { Environment, Sky, Stats } from '@react-three/drei';
import { Pedestrian, PedestrianMovementState } from './3d/objects/Pedestrian';
import { Cyclist } from './3d/objects/Cyclist';
import { Car } from './3d/objects/Car/Car';
import { TrackedObject } from '../TrackedObject';
import { Truck } from './3d/objects/Truck';
import { NormalizedObjectData, RawObjectType } from '@bosch/api-interfaces';
import { MotorBike } from './3d/objects/MotorBike';
import { TruckOrCar } from './3d/objects/TruckOrCar';
import { Simulation } from '../Simulation';
import { Road } from './3d/Road';

export enum ObjectType {
  Unknown = 'Unknown',
  Pedestrian = 'Pedestrian',
  Cyclist = 'Cyclist',
  Car = 'Car',
}

export interface HistoryItem extends NormalizedObjectData {
  timestamp: number;
  actualTimestamp: number;
  itemType: 'measurement' | 'prediction';
}

export function View3D({
  selected,
  showSensors,
  showBlindSpots,
  onSelect,
}: {
  selected: string;
  showBlindSpots: boolean;
  showSensors: boolean;
  onSelect(id: string): void;
}): ReactElement {
  const [data, setData] = useState<TrackedObject[]>([]);
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const listener = () => {
      setData(Simulation.get().trackedObjects);
      setCarPosition({
        x: Simulation.get().carX,
        y: Simulation.get().carY,
      });
    };
    Simulation.get().on('step', listener);
    return () => {
      Simulation.get().off('step', listener);
    };
  }, []);
  const selectedObject = data.find((o) => o.uuid === selected);
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
      <scene>
        <Stats className="stats" />
        <Sky sunPosition={[7, 5, 1]} />
        <fog attach="fog" args={['white', 0, 26]} />

        <Environment files={'assets/venice_sunset_1k.hdr'} path={'/'} />

        <Lights />

        <Car
          color="#E00420"
          noSensor={!showSensors}
          noBlindSpot={!showBlindSpots}
          x={0}
          y={0}
          heading={0}
        />

        <group scale={[1, 1, -1]}>
          {data
            .filter((o) => o.measurements.length > 3)
            .map((trackedObject) => (
              <TrackedObjectItem
                onClick={() => onSelect(trackedObject.uuid)}
                selected={trackedObject.uuid === selected}
                key={trackedObject.uuid}
                object={trackedObject}
              />
            ))}
        </group>

        <BasePlane carPosition={carPosition} />
        <Controls target={selectedObject} />
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
            color:
              historyItem.itemType === 'measurement' ? '#E00420' : '#40A9FF',
            opacity: (index + 1) / (history.length + 1) + 0.5,
          })}
        </group>
      ))}
    </>
  );
}

function TrackedObjectItem({
  object,
  selected,
  onClick,
}: {
  object: TrackedObject;
  selected: boolean;
  onClick?: () => void;
}) {
  const x = object.x;
  const y = object.y;
  const history = object.history.filter(
    (h, index) =>
      index % Math.floor(object.history.length / 20) === 0 ||
      h.itemType === 'measurement'
  );

  if (object.type === RawObjectType.BICYCLE) {
    return (
      <>
        {selected && (
          <History3D
            component={<Cyclist heading={360} x={0} y={0} color="#A00420" />}
            history={history}
          />
        )}
        <Cyclist
          x={x}
          y={y}
          heading={360}
          color={selected ? '#A00420' : '#737A80'}
        />
      </>
    );
  }
  if (object.type === RawObjectType.CAR) {
    return (
      <>
        {selected && (
          <History3D
            component={<UnknownObject x={0} y={0} color="#A00420" />}
            history={history}
          />
        )}
        <Car
          x={x}
          y={y}
          heading={360}
          noSensor
          noBlindSpot
          color={selected ? '#A00420' : '#737A80'}
        />
      </>
    );
  }
  if (object.type === RawObjectType.PEDESTRIAN) {
    return <></>;
  }

  if (object.type === RawObjectType.TRUCK) {
    return (
      <>
        {selected && (
          <History3D
            component={<UnknownObject x={0} y={0} color="#A00420" />}
            history={history}
          />
        )}
        <Truck
          x={x}
          y={y}
          heading={360}
          color={selected ? '#A00420' : '#737A80'}
        />
      </>
    );
  }
  if (object.type === RawObjectType.MOTORBIKE) {
    return (
      <>
        <MotorBike
          x={x}
          y={y}
          heading={360}
          color={selected ? '#A00420' : '#737A80'}
        />
      </>
    );
  }
  //if (object.type === RawObjectType.NO_DETECTION || true) {
  const origin = new Vector3(x, 1, y);
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
          component={<UnknownObject x={0} y={0} color="#A00420" />}
          history={history}
        />
      )}
      <UnknownObject
        onClick={onClick}
        color={selected ? '#A00420' : '#737A80'}
        x={x}
        y={y}
        z={object.z}
        opacity={object.ttl / 20}
      />
    </>
  );
  /*}
  return null;*/
}
