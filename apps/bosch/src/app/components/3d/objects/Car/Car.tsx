import {
  CameraHelper,
  Object3D,
  PerspectiveCamera,
  SpotLight,
  SpotLightHelper,
} from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React, { useEffect, useMemo, useState } from 'react';
import { setMaterials } from './SetCarMaterials';
import { useFrame } from '@react-three/fiber';
import { usePlayback } from '../../../../hooks/usePlayback';
import { Plane, useHelper } from '@react-three/drei';

interface CarProps {
  x: number;
  y: number;
  heading: number;
  leftIndicator?: boolean;
  rightIndicator?: boolean;
  color?: string;
  opacity?: number;
}

export const Car = ({ color = 'gray', opacity = 1, ...props }: CarProps) => {
  const { isPlaying, speed } = usePlayback();
  const [model, setModel] = useState<Object3D>();
  const [wheels, setWheels] = useState<Object3D[]>([]);

  const loader = useMemo(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('assets/draco/gltf/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    return loader;
  }, []);

  useEffect(() => {
    loader.load('assets/ferrari.glb', (gltf) => {
      const carModel = gltf.scene.children[0];
      if (!carModel) {
        console.error('No car model found');
        return;
      }
      setMaterials(carModel, color, opacity);

      const wheelList = [
        carModel.getObjectByName('wheel_fl'),
        carModel.getObjectByName('wheel_fr'),
        carModel.getObjectByName('wheel_rl'),
        carModel.getObjectByName('wheel_rr'),
      ];
      setWheels(wheelList.filter((a) => a) as Object3D[]);
      setModel(carModel);
    });
  }, [loader]);

  useFrame((state, delta, frame) => {
    if (!isPlaying) return;
    wheels.forEach((wheel) => {
      wheel.rotation.x -= delta * speed * Math.PI * 2;
    });
  });

  const cameraRef = React.useRef<PerspectiveCamera>(null);
  useHelper(cameraRef, CameraHelper);

  return (
    <>
      {model && (
        <group
          position={[props.x, 0, props.y]}
          rotation={[0, ((props.heading + 90) * Math.PI) / 180, 0]}
        >
          <primitive object={model} />

          <group position={[0, 0, 0]}>
            <Plane
              rotation={[-Math.PI / 2, 0, 0]}
              position={[2, 0.5, 0]}
              args={[1.5, 2.3]}
            >
              <meshStandardMaterial attach="material" color="red" />
            </Plane>
            <Plane
              rotation={[-Math.PI / 2, 0, 0]}
              position={[-2, 0.5, 0]}
              args={[1.5, 2.3]}
            >
              <meshStandardMaterial attach="material" color="red" />
            </Plane>
          </group>
        </group>
      )}
    </>
  );
};
