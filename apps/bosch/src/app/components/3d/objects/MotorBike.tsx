import { useEffect, useMemo, useState } from 'react';
import { Mesh, MeshPhysicalMaterial, Object3D, Vector3 } from 'three';
import { usePlayback } from '../../../hooks/usePlayback';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { createMaterial } from './Custom3dHelpers';
import { useFrame } from '@react-three/fiber';

interface MotorBikeProps {
  x: number;
  y: number;
  heading: number;
  color?: string;
  opacity?: number;
}

export const MotorBike = (props: MotorBikeProps) => {
  const [model, setModel] = useState<Object3D>();

  const loader = useMemo(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('assets/draco/gltf/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    return loader;
  }, []);

  useEffect(() => {
    loader.load('/assets/motorbike.glb', (gltf) => {
      const modelData = gltf.scene;

      modelData.traverse((object) => {
        if (object instanceof Mesh) object.castShadow = true;
      });

      const bodyMaterial = createMaterial(props.color, props.opacity);

      modelData.traverse((child) => {
        if (child instanceof Mesh) {
          child.material = bodyMaterial;
        }
      });

      setModel(modelData);
    });
  }, [loader, props.color, props.opacity]);

  return (
    <>
      {model && (
        <group
          scale={[0.15, 0.15, 0.15]}
          position={[props.x, 0, props.y]}
          rotation={[Math.PI, Math.PI, ((props.heading + 180) * Math.PI) / 180]}
        >
          <group position={[0, 3.2, 0]}>
            <primitive object={model} />
          </group>
        </group>
      )}
    </>
  );
};
