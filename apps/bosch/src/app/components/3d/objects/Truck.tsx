import React, { useEffect, useMemo, useState } from 'react';
import { Mesh, MeshPhysicalMaterial, Object3D, Vector3 } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { createMaterial, makeMaterialsTransparent } from './Custom3dHelpers';

interface TruckProps {
  x: number;
  y: number;
  heading: number;
  color?: string;
  opacity?: number;
}

export const Truck = ({ opacity = 1, ...props }: TruckProps) => {
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
    loader.load('assets/truck.glb', (gltf) => {
      const truckModel = gltf.scene.children[0];
      if (!truckModel) {
        console.error('No car model found');
        return;
      }

      console.log(truckModel);

      const truckBox = truckModel.getObjectByName('hood_body_0');

      if (truckBox instanceof Mesh) {
        truckBox.material = createMaterial(props.color, opacity);

        const center = new Vector3();
        truckBox.geometry.computeBoundingBox();
        truckBox.geometry.boundingBox.getCenter(center);
        truckBox.geometry.center();
        truckBox.position.copy(center);
      }

      makeMaterialsTransparent(truckModel, opacity);

      setModel(truckModel);
    });
  }, [loader]);

  return (
    <>
      {model && (
        <group
          position={[props.x, 0, props.y]}
          rotation={[0, ((props.heading + 180) * Math.PI) / 180, 0]}
          scale={[0.028, 0.028, 0.028]}
        >
          <primitive object={model} />
        </group>
      )}
    </>
  );
};
