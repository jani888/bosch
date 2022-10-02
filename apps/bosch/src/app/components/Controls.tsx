import React from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { TrackedObject } from '../TrackedObject';
import { Vector3 } from 'three';

export function Controls(): React.ReactElement {
  return (
    <>
      <PerspectiveCamera far={100} position={[-4, 1.8, -3]} makeDefault />
      <OrbitControls
        enableDamping={true}
        maxPolarAngle={(80 / 180) * Math.PI}
        minDistance={5}
        maxDistance={40}
      />
    </>
  );
}
