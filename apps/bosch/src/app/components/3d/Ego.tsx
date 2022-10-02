import { Car } from './objects/Car/Car';
import React from 'react';

export function Ego(props: { showSensors: boolean; showBlindSpots: boolean }) {
  return (
    <Car
      color="#E00420"
      noSensor={!props.showSensors}
      noBlindSpot={!props.showBlindSpots}
      x={0}
      y={0}
      heading={0}
    />
  );
}
