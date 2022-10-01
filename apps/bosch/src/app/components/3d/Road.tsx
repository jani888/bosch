import { Plane } from '@react-three/drei';
import React from 'react';

export const Road = ({
  lanes = 1,
  ...props
}: {
  laneWidth: number;
  length: number;
  rotation: number;
  lanes?: number;
}) => {
  const lanegap = 0.3;
  return (
    <>
      <Plane
        rotation={[-Math.PI / 2, 0, props.rotation * (Math.PI / 180)]}
        position={[((props.laneWidth + lanegap) * lanes) / 2, 0.001, 0]}
        args={[(props.laneWidth + lanegap) * lanes, props.length]}
      >
        <meshBasicMaterial attach="material" color="#3d3d3d" />
      </Plane>

      {Array(lanes - 1)
        .fill(0)
        .map((_, i) => (
          <Plane
            rotation={[-Math.PI / 2, 0, props.rotation * (Math.PI / 180)]}
            position={[(props.laneWidth + lanegap) * (i + 1), 0.01, 0]}
            args={[lanegap, props.length]}
          >
            <meshBasicMaterial attach="material" color="white" />
          </Plane>
        ))}
    </>
  );
};
