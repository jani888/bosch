import {
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  LineBasicMaterial,
  LineLoop,
  Vector3,
} from 'three';
import { UnknownObject } from './objects/UnknownObject';
import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Car } from './objects/Car/Car';
import { Truck } from './objects/Truck';

type Component = typeof Car | typeof UnknownObject | typeof Truck;

interface LineProps {
  points: { x: number; y: number }[];
  color: string;
  showPoints?: boolean;
  component: Component;
}

export const Line3D = (props: LineProps) => {
  const [fraction, setFraction] = useState(0);
  const [normal, setNormal] = useState(new Vector3(0, 0, 0));

  const curve = new CatmullRomCurve3(
    props.points.map((p) => new Vector3(p.x, 0, p.y)),
    true
  );

  const points = curve.getPoints(60);
  const line = new LineLoop(
    new BufferGeometry().setFromPoints(points),
    new LineBasicMaterial({ color: new Color(props.color).getHex() })
  );

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
    </>
  );
};
