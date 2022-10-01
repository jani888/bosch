import { useEffect, useMemo, useState } from 'react';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Mesh, MeshPhysicalMaterial, Object3D, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { usePlayback } from '../../../hooks/usePlayback';
import { createMaterial } from './Custom3dHelpers';
import { useGLTF } from '@react-three/drei';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';

interface CyclistProps {
  x: number;
  y: number;
  heading: number;
  color?: string;
  opacity?: number;
}

export const Cyclist = (props: CyclistProps) => {
  const [model, setModel] = useState<Object3D>();
  const { isPlaying, speed } = usePlayback();

  const [wheels, setWheels] = useState<Object3D[]>([]);

  const rawModel = useGLTF('/assets/bicycle.glb', true);

  useEffect(() => {
    const modelData = SkeletonUtils.clone(rawModel.scene);

    modelData.traverse((object) => {
      if (object instanceof Mesh) object.castShadow = true;
    });

    const bodyMaterial = createMaterial(props.color, props.opacity);

    modelData.children.forEach((child) => {
      if (child instanceof Mesh) {
        child.material = bodyMaterial;

        const center = new Vector3();
        child.geometry.computeBoundingBox();
        child.geometry.boundingBox.getCenter(center);
        child.geometry.center();
        child.position.copy(center);
      }
    });

    const wheelList = [
      modelData.getObjectByName('Wheel_back'),
      modelData.getObjectByName('Wheel_front'),
    ];

    wheelList.forEach((wheel) => {
      //set wheel color to black
      const wheelMaterial = new MeshPhysicalMaterial({
        color: 'black',
        opacity: props.opacity || 1,
        transparent: true,
        metalness: 0.6,
        roughness: 0.5,
      });
      if (wheel instanceof Mesh) {
        wheel.material = wheelMaterial;
      }
    });

    setWheels(wheelList.filter((a) => a) as Object3D[]);

    setModel(modelData);
  }, [props.color, props.opacity]);

  useFrame((state, delta, frame) => {
    if (!isPlaying) return;
    wheels.forEach((wheel) => {
      wheel.rotation.y += delta * speed * Math.PI;
    });
  });

  return (
    <>
      {model && (
        <group
          scale={[0.028, 0.028, 0.028]}
          position={[props.x, 0, props.y]}
          rotation={[-Math.PI / 2, 0, (props.heading * Math.PI) / 180]}
        >
          <primitive object={model} />
        </group>
      )}
    </>
  );
};
