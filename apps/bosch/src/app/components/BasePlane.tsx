import { Plane } from '@react-three/drei';
import React from 'react';
import { DoubleSide } from 'three';

export function BasePlane() {
  return (
    <>
      <gridHelper args={[1000, 500]}>
        <meshBasicMaterial color="gray" side={DoubleSide} />
      </gridHelper>
      <Plane
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.001, 0]}
        args={[1000, 1000]}
      >
        <meshStandardMaterial attach="material" color="white" />
      </Plane>
    </>
  );
}
