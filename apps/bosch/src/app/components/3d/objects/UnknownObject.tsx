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
    <mesh position={[x, 0.5, y]} castShadow={true}>
      <capsuleGeometry args={[0.25, 0.5, 10, 15]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};
