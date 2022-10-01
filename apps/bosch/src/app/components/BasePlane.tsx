import { Plane } from '@react-three/drei';
import React, { useState } from 'react';
import { DoubleSide } from 'three';
import { useFrame } from '@react-three/fiber';

export function BasePlane({
  carPosition,
}: {
  carPosition: { x: number; y: number };
}) {
  return (
    <>
      <gridHelper
        args={[1000, 1000]}
        position={[-carPosition.x, -0.01, -carPosition.y]}
      >
        <meshBasicMaterial color="gray" side={DoubleSide} />
      </gridHelper>
      <Plane
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-carPosition.x, -0.02, -carPosition.y]}
        args={[1000, 1000]}
      >
        <meshStandardMaterial attach="material" color="white" />
      </Plane>
    </>
  );
}
