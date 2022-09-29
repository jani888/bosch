import React from 'react';
import { Canvas } from '@react-three/fiber';
import { UnknownObject } from './3d/objects/UnknownObject';
import { BasePlane } from './BasePlane';
import { Lights } from './Lights';
import { Controls } from './Controls';
import { ACESFilmicToneMapping, Fog, sRGBEncoding } from 'three';
import { Environment } from '@react-three/drei';
import { Car } from './3d/objects/Car/Car';

export function View3D() {
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

        <UnknownObject x={5} y={0} />
        <Car heading={45} x={0} y={0} />

        <BasePlane />
        <Controls />
      </scene>
    </Canvas>
  );
}
