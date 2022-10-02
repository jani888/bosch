import { TrackedObject } from '../../TrackedObject';
import { RawObjectType } from '@bosch/api-interfaces';
import { History3D } from './History3D';
import { Cyclist } from './objects/Cyclist';
import { UnknownObject } from './objects/UnknownObject';
import { Car } from './objects/Car/Car';
import { Truck } from './objects/Truck';
import { MotorBike } from './objects/MotorBike';
import { Vector3 } from 'three';
import React from 'react';

interface TrackedObjectItemProps {
  object: TrackedObject;
  selected: boolean;
  onClick?: () => void;
}

export function TrackedObjectItem({
  object,
  selected,
  onClick,
}: TrackedObjectItemProps) {
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
  return (
    <>
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
}
