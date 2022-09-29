import {
  DirectionalLight,
  DirectionalLightHelper,
  Euler,
  MultiplyBlending,
  Object3D,
  PointLight,
  PointLightHelper,
  SpotLight,
  SpotLightHelper,
  TextureLoader,
  Vector3,
} from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React, { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { setMaterials } from './SetCarMaterials';
import { useFrame } from '@react-three/fiber';
import { useHelper } from '@react-three/drei';

interface CarProps {
  x: number;
  y: number;
  heading: number;
  leftIndicator?: boolean;
  rightIndicator?: boolean;
}

export const Car = (props: CarProps) => {
  const [model, setModel] = useState<Object3D>();
  const [wheels, setWheels] = useState<Object3D[]>([]);

  const shadow = new TextureLoader().load('assets/ferrari_ao.png');

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
      setMaterials(carModel);

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
    wheels.forEach((wheel) => {
      wheel.rotation.x -= delta * Math.PI * 2;
    });
  });

  return (
    <>
      {model && (
        <group
          position={[props.x, 0, props.y]}
          rotation={[0, (props.heading * Math.PI) / 180, 0]}
        >
          <primitive object={model} />
          <mesh renderOrder={2} rotation={new Euler(-Math.PI / 2)}>
            <planeGeometry args={[0.655 * 4, 1.3 * 4]} />
            <meshBasicMaterial
              map={shadow}
              blending={MultiplyBlending}
              toneMapped={false}
              transparent={true}
            />
          </mesh>
        </group>
      )}
    </>
  );
};
