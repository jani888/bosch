import { Plane } from '@react-three/drei';
import React, { useState } from 'react';
import { DoubleSide } from 'three';
import { useFrame } from '@react-three/fiber';

export function BasePlane() {
  const [x, setX] = useState(0);
  useFrame(() => {
    setX((v) => v - 0.01);
  });
  return (
    <>
      <gridHelper args={[1000, 1000]} position={[x, -0.01, 0]}>
        <meshBasicMaterial color="gray" side={DoubleSide} />
      </gridHelper>
      <Plane
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[x, -0.02, 0]}
        args={[1000, 1000]}
      >
        <meshStandardMaterial attach="material" color="white" />
      </Plane>
    </>
  );
}
