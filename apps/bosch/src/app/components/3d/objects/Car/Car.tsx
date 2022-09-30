import { CameraHelper, Object3D, PerspectiveCamera } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React, { useEffect, useMemo, useState } from 'react';
import { setMaterials } from './SetCarMaterials';
import { useFrame } from '@react-three/fiber';
import { usePlayback } from '../../../../hooks/usePlayback';
import { Plane } from '@react-three/drei';

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

  const sensors = sensorPositions.map((sensorPos) => {
    const camera = new PerspectiveCamera(80, 2, 2, 10);
    const camHelper = new CameraHelper(camera);

    camera.position.set(sensorPos.y, sensorPos.z, sensorPos.x);
    camera.rotation.set(
      (sensorPos.elevation_angle * Math.PI) / 180,
      Math.PI + (sensorPos.azimuth_angle * Math.PI) / 180,
      0
    );
    return {
      name: sensorPos.name,
      camera,
      helper: camHelper,
    };
  });

  return (
    <>
      {model && (
        <group
          position={[props.x, 0, props.y]}
          rotation={[0, ((props.heading + 90) * Math.PI) / 180, 0]}
        >
          <group
            rotation={[0, Math.PI, 0]}
            position={[0, 0, 1.33]}
            scale={[0.98, 0.98, 0.98]}
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

          {sensors.map((sensor) => (
            <primitive object={sensor.camera} />
          ))}
        </group>
      )}
      {sensors.map((sensor, index) => (
        <primitive object={sensor.helper} />
      ))}
    </>
  );
};

//Angles are in degrees
//Position is in millimeters
const sensorPositions: {
  name: string;
  x: number;
  y: number;
  z: number;
  elevation_angle: number;
  azimuth_angle: number;
}[] = [
  {
    name: 'left-front',
    x: 3.4738,
    y: 0.6286,
    z: 0.5156,
    elevation_angle: 0,
    azimuth_angle: 42,
  },
  {
    name: 'left-rear',
    x: -0.7664,
    y: 0.738,
    z: 0.7359,
    elevation_angle: 0.48,
    azimuth_angle: 135,
  },
  {
    name: 'right-front',
    x: 3.4738,
    y: -0.6286,
    z: 0.5156,
    elevation_angle: 0,
    azimuth_angle: -42,
  },
  {
    name: 'right-rear',
    x: -0.7664,
    y: -0.738,
    z: 0.7359,
    elevation_angle: 0.48,
    azimuth_angle: -135,
  },
];
