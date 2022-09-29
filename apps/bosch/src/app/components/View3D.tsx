import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Box } from './3d/Box';
import { OrbitControls, PerspectiveCamera, Plane } from '@react-three/drei';
import { DoubleSide } from 'three';

export function View3D() {
  return (
    <Canvas
      style={{ height: '100%', width: '100%' }}
      shadows={true}
      gl={{ antialias: true }}
    >
      <ambientLight />
      <pointLight
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        position={[0, 10, 0]}
        intensity={1}
        castShadow={true}
      />
      <Box position={[-1.2, 2, 0]} castShadow={true} />
      <Box position={[1.2, 2, 0]} castShadow={true} />

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

      <PerspectiveCamera position={[2, 2, 2]} makeDefault />
      <OrbitControls
        maxPolarAngle={(80 / 180) * Math.PI}
        minDistance={10}
        maxDistance={80}
      />
    </Canvas>
  );
}
