import { Plane } from '@react-three/drei';
import React from 'react';
import { Vector3 } from 'three';

export const Road = ({
  lanes = 1,
  ...props
}: {
  laneWidth: number;
  length: number;
  rotation: number;
  centerLane: number;
  lanes?: number;
}) => {
  const lanegap = 0.3;
  return (
    <group rotation={[-Math.PI / 2, 0, props.rotation * (Math.PI / 180)]}>
      <group
        position={[
          -(
            props.centerLane * (props.laneWidth + lanegap) +
            props.laneWidth / 2
          ),
          0,
          0,
        ]}
      >
        <Plane
          position={[((props.laneWidth + lanegap) * lanes) / 2, 0.001, 0]}
          args={[(props.laneWidth + lanegap) * lanes, props.length]}
        >
          <meshBasicMaterial attach="material" color="#3d3d3d" />
        </Plane>

        <group position={[0, 0, 0.1]}>
          {Array(lanes - 1)
            .fill(0)
            .map((_, i) => (
              <Plane
                position={[(props.laneWidth + lanegap) * (i + 1), 0, 0]}
                args={[lanegap, props.length]}
              >
                <meshBasicMaterial attach="material" color="white" />
              </Plane>
            ))}
        </group>
      </group>
    </group>
  );
};
