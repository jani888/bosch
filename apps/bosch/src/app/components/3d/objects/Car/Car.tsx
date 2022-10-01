import { Color, Mesh, Object3D, PlaneGeometry, ShaderMaterial } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React, { createRef, useEffect, useMemo, useState } from 'react';
import { setMaterials } from './SetCarMaterials';
import { useFrame, useThree } from '@react-three/fiber';
import { usePlayback } from '../../../../hooks/usePlayback';
import { Plane, useGLTF } from '@react-three/drei';
import { getCarSensors } from './GetCarSensors';
import { Simulation } from '../../../../Simulation';

interface CarProps {
  x: number;
  y: number;
  heading: number;
  leftIndicator?: boolean;
  rightIndicator?: boolean;
  color?: string;
  opacity?: number;
  noSensor?: boolean;
  noBlindSpot?: boolean;
}

export const Car = ({ color = 'gray', opacity = 1, ...props }: CarProps) => {
  const { isPlaying, speed } = usePlayback();
  const [model, setModel] = useState<Object3D>();
  const [wheels, setWheels] = useState<Object3D[]>([]);
  const [fixRotation, setFixRotation] = useState(90);

  const rawModel = useGLTF('assets/ferrari.glb', true);

  const sensors = useMemo(() => getCarSensors(), []);

  const [leftBlindSpot, setLeftBlindSpot] = useState(false);
  const [rightBlindSpot, setRightBlindSpot] = useState(false);
  const simulation = useMemo(() => Simulation.get(), []);
  useEffect(() => {
    const listener = () => {
      setLeftBlindSpot(simulation.leftBlindSpot.length > 0);
      setRightBlindSpot(simulation.rightBlindSpot.length > 0);
    };
    simulation.on('blindSpotChange', listener);
    return () => {
      simulation.off('blindSpotChange', listener);
    };
  }, [simulation]);

  useThree(({ scene }) => {
    sensors.forEach((sensor) => {
      scene.add(sensor.camera);
    });
  });

  useEffect(() => {
    const carModel = rawModel.scene.clone().children[0];
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
    setFixRotation(0);
  }, [rawModel, color, opacity]);

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
          position={[props.x, 0, props.y]}
          rotation={[
            0,
            ((props.heading + 90 + fixRotation) * Math.PI) / 180,
            0,
          ]}
        >
          <group
            rotation={[0, Math.PI, 0]}
            position={[0, 0, 1.33]}
            scale={[0.98, 0.98, 0.98]}
          >
            <primitive object={model} />
            {!props.noBlindSpot && (
              <group position={[0, 0, 0]}>
                <Plane
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[2.8, 0.5, 0.5]}
                  args={[3, 3]}
                >
                  <meshStandardMaterial
                    attach="material"
                    color="#E00420"
                    transparent={true}
                    opacity={rightBlindSpot ? 0.8 : 0.3}
                  />
                </Plane>
                <Plane
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[-2.8, 0.5, 0.5]}
                  args={[3, 3]}
                >
                  <meshStandardMaterial
                    attach="material"
                    color="#E00420"
                    transparent={true}
                    opacity={leftBlindSpot ? 0.8 : 0.3}
                  />
                </Plane>
              </group>
            )}
          </group>
          {!props.noSensor &&
            sensors.map((sensor) => (
              <>
                <primitive object={sensor.camera} key={sensor.camera.uuid} />
                <primitive object={sensor.helper} key={sensor.helper.uuid} />
              </>
            ))}
        </group>
      )}
    </>
  );
};
