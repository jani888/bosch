// High frequency data network 3D demo
import { ACESFilmicToneMapping, sRGBEncoding } from 'three';
import { Environment, Stats } from '@react-three/drei';
import { Lights } from './Lights';
import { BasePlane } from './BasePlane';
import { Controls } from './Controls';
import { Canvas } from '@react-three/fiber';
import React from 'react';
import { Line3D } from './3d/Line3D';
import { Car } from './3d/objects/Car/Car';
import { Pedestrian } from './3d/objects/Pedestrian';
import { Road } from './3d/Road';

export const HfdnDemo = (props: { isPlaying: boolean }) => {
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
          color={'orange'}
          points={[
            { x: 2, y: 2 },
            { x: 2, y: 6 },
            { x: 2, y: 25 },
            { x: 25, y: 25 },
            { x: 25, y: -2 },
            { x: 8, y: -2 },
            { x: 4, y: -2 },
          ]}
          startOffset={0.8}
          component={Car}
          isPlaying={props.isPlaying}
        />

        <Line3D
          color={'blue'}
          points={[
            { x: 10, y: 8 },
            { x: 10, y: 9 },
            { x: -2, y: 9 },
            { x: -2, y: 8 },
          ]}
          component={Pedestrian}
          isPlaying={props.isPlaying}
        />

        <Road laneWidth={4} lanes={2} length={50} rotation={90} />

        <Road laneWidth={4} lanes={2} length={50} rotation={0} />

        <BasePlane />
        <Controls />
      </scene>
    </Canvas>
  );
};
