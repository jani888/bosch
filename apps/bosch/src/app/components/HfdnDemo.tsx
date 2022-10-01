// High frequency data network 3D demo
import { ACESFilmicToneMapping, sRGBEncoding, Vector3 } from 'three';
import { Environment, Stats } from '@react-three/drei';
import { Lights } from './Lights';
import { BasePlane } from './BasePlane';
import { Controls } from './Controls';
import { Canvas } from '@react-three/fiber';
import React, { useState } from 'react';
import { Line3D } from './3d/Line3D';
import { Car } from './3d/objects/Car/Car';
import { Cyclist } from './3d/objects/Cyclist';
import { MotorBike } from './3d/objects/MotorBike';
import { Pedestrian } from './3d/objects/Pedestrian';
import { Truck } from './3d/objects/Truck';

export const HfdnDemo = () => {
  const [carPos, setCarPos] = useState(new Vector3(0, 0, 0));
  const [carRot, setCarRot] = useState(0);

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
        <Stats />

        <fog color={0x333333} near={80} far={100} />

        <Environment
          background={true} // Whether to affect scene.background
          files={'assets/venice_sunset_1k.hdr'}
          path={'/'}
        />

        <Lights />

        <Line3D
          color={'blue'}
          points={[
            { x: 0, y: 0 },
            { x: 0, y: 10 },
            { x: 10, y: 10 },
            { x: 10, y: 0 },
          ]}
          component={Car}
        />

        <BasePlane />
        <Controls />
      </scene>
    </Canvas>
  );
};
