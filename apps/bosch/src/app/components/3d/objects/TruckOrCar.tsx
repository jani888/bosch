import { Box3, Mesh } from 'three';
import { createBoxWithRoundedEdges, createMaterial } from './Custom3dHelpers';

interface TruckOrCarProps {
  x: number;
  y: number;
  heading: number;
  color?: string;
  opacity?: number;
}

export const TruckOrCar = ({
  x,
  y,
  color = '#4d4d4d',
  opacity = 1,
}: TruckOrCarProps) => {
  const height = 1.95;

  const truckOrCar = createBoxWithRoundedEdges(4, height, 2.18, 0.3, 50);

  const material = createMaterial(color, opacity);
  const mesh = new Mesh(truckOrCar, material);

  return (
    <group position={[x, height / 2 + 0.1, y]}>
      <primitive object={mesh} />
    </group>
  );
};
