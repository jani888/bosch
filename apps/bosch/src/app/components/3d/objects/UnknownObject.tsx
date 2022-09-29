interface UnknownObjectProps {
  x: number;
  y: number;
  color?: string;
}

export const UnknownObject = ({
  x,
  y,
  color = '#4d4d4d',
}: UnknownObjectProps) => {
  return (
    <mesh position={[x, 2, y]} castShadow={true}>
      <capsuleGeometry args={[1, 2, 10, 15]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};
