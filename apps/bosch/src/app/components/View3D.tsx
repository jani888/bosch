import React, { ReactElement, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { BasePlane } from './BasePlane';
import { Lights } from './Lights';
import { Controls } from './Controls';
import { ACESFilmicToneMapping, sRGBEncoding } from 'three';
import { Environment, Sky, Stats } from '@react-three/drei';
import { TrackedObject } from '../TrackedObject';
import { NormalizedObjectData } from '@bosch/api-interfaces';
import { useSimulation } from '../hooks/useSimulation';
import { TrackedObjectItem } from './3d/TrackedObjectItem';
import { Ego } from './3d/Ego';

export interface HistoryItem extends NormalizedObjectData {
  timestamp: number;
  actualTimestamp: number;
  itemType: 'measurement' | 'prediction';
}

interface View3DProps {
  selected: string;
  showBlindSpots: boolean;
  showSensors: boolean;

  onSelect(id: string): void;
}

export function View3D({
  selected,
  showSensors,
  showBlindSpots,
  onSelect,
}: View3DProps): ReactElement {
  const [data, setData] = useState<TrackedObject[]>([]);
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0 });
  const simulation = useSimulation();
  useEffect(() => {
    const listener = () => {
      setData(simulation.trackedObjects);
      setCarPosition({
        x: simulation.carX,
        y: simulation.carY,
      });
    };
    simulation.on('step', listener);
    return () => {
      simulation.off('step', listener);
    };
  }, []);
  return (
    <Canvas
      style={{ height: '100%', width: '100%' }}
      shadows={true}
      gl={{
        antialias: true,
        outputEncoding: sRGBEncoding,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 0.85,
        pixelRatio: window.devicePixelRatio,
      }}
    >
      <scene>
        <Stats className="stats" />
        <Sky sunPosition={[7, 5, 1]} />
        <fog attach="fog" args={['white', 0, 26]} />

        <Environment files={'assets/venice_sunset_1k.hdr'} path={'/'} />

        <Lights />

        <Ego showSensors={showSensors} showBlindSpots={showBlindSpots} />

        <group scale={[1, 1, -1]}>
          {data
            .filter((o) => o.measurements.length > 3)
            .map((trackedObject) => (
              <TrackedObjectItem
                onClick={() => onSelect(trackedObject.uuid)}
                selected={trackedObject.uuid === selected}
                key={trackedObject.uuid}
                object={trackedObject}
              />
            ))}
        </group>

        <BasePlane carPosition={carPosition} />
        <Controls />
      </scene>
    </Canvas>
  );
}
