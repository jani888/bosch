import React from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

export function Controls() {
  return (
    <>
      <PerspectiveCamera position={[2, 2, 2]} makeDefault />
      <OrbitControls
        enableDamping={true}
        maxPolarAngle={(80 / 180) * Math.PI}
        minDistance={5}
        maxDistance={80}
      />
    </>
  );
}
