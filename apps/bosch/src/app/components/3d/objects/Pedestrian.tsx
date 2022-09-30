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

interface PedestrianProps {
  x: number;
  y: number;
  heading: number;
  color?: string;
  opacity?: number;
  //TODO: MovementState NOT implemented yet
  movementState?: PedestrianMovementState;
}

export enum PedestrianMovementState {
  Idle = 0,
  Walking = 6,
  Running = 3,
}

export const Pedestrian = ({
  movementState = PedestrianMovementState.Idle,
  ...props
}: PedestrianProps) => {
  const [model, setModel] = useState<Object3D>();
  const [mixer, setMixer] = useState<AnimationMixer>();
  const [lastMovementState, setLastMovementState] =
    useState<PedestrianMovementState>(movementState);
  const [animations, setAnimations] = useState<AnimationClip[]>([]);

  const loader = useMemo(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('assets/draco/gltf/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    return loader;
  }, []);

  useEffect(() => {
    loader.load('/assets/Xbot.glb', (gltf) => {
      const modelData = gltf.scene;

      modelData.traverse((object) => {
        if (object instanceof Mesh) object.castShadow = true;
      });

      const bodyMaterial = new MeshPhysicalMaterial({
        color: 0xff6f00,
        metalness: 1.0,
        roughness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        sheen: 0.5,
      });

      modelData.children.forEach((child) => {
        if (child instanceof Mesh) {
          child.material = bodyMaterial;
        }
      });

      const mixer = new AnimationMixer(gltf.scene);
      mixer.clipAction(gltf.animations[movementState]).play();

      setMixer(mixer);
      setModel(gltf.scene);
      setAnimations(gltf.animations);
    });
  }, [loader]);

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
          position={[props.x, 0, props.y]}
          rotation={[0, (props.heading * Math.PI) / 180, 0]}
        >
          <primitive object={model} />
        </group>
      )}
    </>
  );
};
