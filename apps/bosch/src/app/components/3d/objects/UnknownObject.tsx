interface UnknownObjectProps {
  x: number;
  y: number;
  z?: number;
  color?: string;
  opacity?: number;
  onClick?: () => void;
}

export const UnknownObject = ({
  x,
  y,
  z = 0,
  color = '#4d4d4d',
  opacity = 1,
  onClick,
}: UnknownObjectProps) => {
  return (
    <mesh onClick={onClick} position={[x, 0.5 + z, y]} castShadow={true}>
      <capsuleGeometry args={[0.25, 0.5, 10, 15]} />
      <meshStandardMaterial
        color={color}
        opacity={opacity}
        transparent={true}
      />
    </mesh>
  );
};
