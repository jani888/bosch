import React from 'react';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { TrackedObject } from '../TrackedObject';

export function Controls({
  target,
}: {
  target?: TrackedObject;
}): React.ReactElement {
  return (
    <>
      <PerspectiveCamera position={[10, 10, 10]} makeDefault />
      <OrbitControls
        enableDamping={true}
        maxPolarAngle={(80 / 180) * Math.PI}
        minDistance={5}
        maxDistance={80}
      />
    </>
  );
}
