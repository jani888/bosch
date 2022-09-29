import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import React from 'react';

export function Controls() {
  return (
    <>
      <PerspectiveCamera position={[2, 2, 2]} makeDefault />
      <OrbitControls
        maxPolarAngle={(80 / 180) * Math.PI}
        minDistance={10}
        maxDistance={80}
      />
    </>
  );
}
