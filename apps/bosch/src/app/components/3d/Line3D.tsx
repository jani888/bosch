import {
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  LineBasicMaterial,
  LineLoop,
  Vector2,
  Vector3,
} from 'three';
import { UnknownObject } from './objects/UnknownObject';
import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Car } from './objects/Car/Car';
import { Truck } from './objects/Truck';
import { Pedestrian, PedestrianMovementState } from './objects/Pedestrian';
import { usePlayback } from '../../hooks/usePlayback';

type Component =
  | typeof Car
  | typeof UnknownObject
  | typeof Truck
  | typeof Pedestrian;

interface LineProps {
  points: { x: number; y: number }[];
  color: string;
  startOffset?: number;
  showPoints?: boolean;
  component: Component;
  isPlaying?: boolean;
}

export const Line3D = ({
  startOffset = 0,
  isPlaying = false,
  ...props
}: LineProps) => {
  const [fraction, setFraction] = useState(0.001 + startOffset);
  const [position, setPosition] = useState(new Vector2(0, 0));
  const [rotation, setRotation] = useState(0);
  const [speed, setSpeed] = useState(0);

  const curve = new CatmullRomCurve3(
    props.points.map((p) => new Vector3(p.x, 0, p.y)),
    true
  );

  const points = curve.getPoints(60);
  const line = new LineLoop(
    new BufferGeometry().setFromPoints(points),
    new LineBasicMaterial({ color: new Color(props.color).getHex() })
  );

  const Component = props.component;

  useFrame(() => {
    if (!isPlaying) {
      setSpeed(0);
      return;
    }

    setFraction(fraction + 0.001);
    if (fraction > 1) {
      setFraction(0.001);
      return;
    }
    const point = curve.getPointAt(fraction);

    setSpeed(new Vector2(point.x, point.z).sub(position).length());

    setPosition(new Vector2(point.x, point.z));

    const tangent = curve.getTangent(fraction);
    const a = tangent.cross(new Vector3(0, 1, 0));

    const angle = Math.atan2(a.x, a.z);
    setRotation(angle * (180 / Math.PI));
  });

  return (
    <>
      <primitive object={line} />

      {props.showPoints &&
        props.points.map((p) => (
          <UnknownObject
            key={p.x + '-' + p.y}
            x={p.x}
            y={p.y}
            color={props.color}
          />
        ))}

      <Component
        x={position.x}
        y={position.y}
        color={props.color}
        heading={rotation}
        noSensor
        movementState={
          speed > 0.04
            ? PedestrianMovementState.Running
            : speed > 0.02
            ? PedestrianMovementState.Walking
            : PedestrianMovementState.Idle
        }
      />
    </>
  );
};
