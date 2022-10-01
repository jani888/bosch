import React, { useEffect, useMemo, useState } from 'react';
import { Mesh, MeshPhysicalMaterial, Object3D, Vector3 } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { createMaterial, makeMaterialsTransparent } from './Custom3dHelpers';
import { useGLTF } from '@react-three/drei';
import { raw } from 'express';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';

interface TruckProps {
  x: number;
  y: number;
  heading: number;
  color?: string;
  opacity?: number;
}

export const Truck = ({ opacity = 1, ...props }: TruckProps) => {
  const [model, setModel] = useState<Object3D>();

  const rawModel = useGLTF('/assets/truck.glb', true);

  useEffect(() => {
    const truckModel = SkeletonUtils.clone(rawModel.scene).children[0];
    if (!truckModel) {
      console.error('No car model found');
      return;
    }

    const truckBox = truckModel.getObjectByName('hood_body_0');

    if (truckBox instanceof Mesh) {
      truckBox.material = createMaterial(props.color, opacity);
    }

    makeMaterialsTransparent(truckModel, opacity);

    setModel(truckModel);
  }, [rawModel, props.color, opacity]);

  if (model) {
    model.position.set(props.x, 0, props.y);
    model.rotation.z = (props.heading * Math.PI) / 180;
    model.scale.set(0.028, 0.028, 0.028);
  }

  return <>{model && <primitive object={model} />}</>;
};
