import { useEffect, useMemo, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
} from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { useGLTF } from '@react-three/drei';

interface PedestrianProps {
  x: number;
  y: number;
  heading: number;
  color?: string;
  opacity?: number;
  onClick?: () => void;
  //TODO: MovementState NOT implemented yet
  movementState?: PedestrianMovementState;
}

export enum PedestrianMovementState {
  Idle = 0,
  Walking = 6,
  Running = 3,
}

function colorPedestrian(color: string, opacity: number, modelData: Object3D) {
  const bodyMaterial = new MeshPhysicalMaterial({
    color: color,
    opacity: opacity,
    transparent: opacity < 1,
    metalness: 0.4,
    roughness: 0.8,
    clearcoat: 1.0,
  });

  const jointMaterial = new MeshPhysicalMaterial({
    color: color,
    opacity: opacity,
    transparent: opacity < 1,
    metalness: 0.8,
    reflectivity: 0.8,
    roughness: 0.0,
  });

  const betaJoints = modelData.getObjectByName('Beta_Joints');
  if (betaJoints instanceof Mesh) {
    betaJoints.material = jointMaterial;
  }

  const betaSurface = modelData.getObjectByName('Beta_Surface');
  if (betaSurface instanceof Mesh) {
    betaSurface.material = bodyMaterial;
  }
}

export const Pedestrian = ({
  movementState = PedestrianMovementState.Idle,
  color = 'gray',
  opacity = 1,
  ...props
}: PedestrianProps) => {
  const [model, setModel] = useState<Object3D>();
  const [mixer, setMixer] = useState<AnimationMixer>();
  const [lastMovementState, setLastMovementState] =
    useState<PedestrianMovementState>(movementState);
  const [animations, setAnimations] = useState<AnimationClip[]>([]);

  const rawModel = useGLTF('/assets/Xbot.glb', true);

  useEffect(() => {
    const modelData = SkeletonUtils.clone(rawModel.scene);

    colorPedestrian(color, opacity, modelData);

    const mixer = new AnimationMixer(modelData);
    mixer.clipAction(rawModel.animations[movementState]).play();

    setMixer(mixer);
    setModel(modelData);
    setAnimations(rawModel.animations);
  }, [color, opacity, movementState]);

  useEffect(() => {
    if (mixer) {
      //TODO: Change between animation clips
      /*mixer
        .clipAction(animations[lastMovementState])
        .crossFadeTo(mixer.clipAction(animations[movementState]), 1, true);
      setLastMovementState(movementState);*/
    }
  }, [movementState]);

  useFrame((state, delta, frame) => {
    if (mixer) mixer.update(delta);
  });

  return (
    <>
      {model && (
        <group
          onClick={props.onClick}
          position={[props.x, 0, props.y]}
          rotation={[0, ((props.heading + 90) * Math.PI) / 180, 0]}
        >
          <primitive object={model} />
        </group>
      )}
    </>
  );
};
