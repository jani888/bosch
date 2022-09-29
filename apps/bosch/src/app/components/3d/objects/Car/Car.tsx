import { Euler, MultiplyBlending, Object3D, TextureLoader } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React, { useEffect, useMemo, useState } from 'react';
import { setMaterials } from './SetCarMaterials';
import { useFrame } from '@react-three/fiber';
import { usePlayback } from '../../../../hooks/usePlayback';

interface CarProps {
  x: number;
  y: number;
  heading: number;
  leftIndicator?: boolean;
  rightIndicator?: boolean;
}

export const Car = (props: CarProps) => {
  const { isPlaying, speed } = usePlayback();
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
    if (!isPlaying) return;
    wheels.forEach((wheel) => {
      wheel.rotation.x -= delta * speed * Math.PI * 2;
    });
  });

  return (
    <>
      {model && (
        <group
          position={[props.x, props.y, 0]}
          rotation={[0, (props.heading * Math.PI) / 180, 0]}
        >
          <primitive object={model} />
        </group>
      )}
    </>
  );
};
