import { useEffect, useMemo, useState } from 'react';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Mesh, MeshPhysicalMaterial, Object3D, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { usePlayback } from '../../../hooks/usePlayback';

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

  const loader = useMemo(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('assets/draco/gltf/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    return loader;
  }, []);

  useEffect(() => {
    loader.load('/assets/bicycle.glb', (gltf) => {
      const modelData = gltf.scene;

      modelData.traverse((object) => {
        if (object instanceof Mesh) object.castShadow = true;
      });

      const bodyMaterial = new MeshPhysicalMaterial({
        color: props.color || 'gray',
        opacity: props.opacity || 1,
        transparent: true,
        metalness: 0.6,
        roughness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        sheen: 0.5,
      });

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
    });
  }, [loader, props.color, props.opacity]);

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
          rotation={[-Math.PI / 2, 0, ((props.heading + 180) * Math.PI) / 180]}
        >
          <primitive object={model} />
        </group>
      )}
    </>
  );
};
