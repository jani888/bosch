import React from 'react';
import { Canvas } from '@react-three/fiber';
import { UnknownObject } from './3d/objects/UnknownObject';
import { BasePlane } from './BasePlane';
import { Lights } from './Lights';
import { Controls } from './Controls';

export function View3D() {
  return (
    <Canvas
      style={{ height: '100%', width: '100%' }}
      shadows={true}
      gl={{ antialias: true }}
    >
      <Lights />

      <UnknownObject x={5} y={0} />

      <BasePlane />
      <Controls />
    </Canvas>
  );
}
