import {
  ExtrudeGeometry,
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
  Shape,
} from 'three';

export const createMaterial = (
  color?: string,
  opacity?: number
): MeshPhysicalMaterial => {
  return new MeshPhysicalMaterial({
    color: color || 'gray',
    opacity: opacity || 1,
    transparent: true,
    metalness: 0.6,
    roughness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    sheen: 0.5,
  });
};

export const makeMaterialsTransparent = (modell: Object3D, opacity: number) => {
  modell.traverse((object) => {
    if (object instanceof Mesh) {
      object.material.opacity = opacity;
      object.material.transparent = opacity < 1;
    }
  });
};

export const createBoxWithRoundedEdges = (
  width: number,
  height: number,
  depth: number,
  radius0: number,
  smoothness: number
): ExtrudeGeometry => {
  const shape = new Shape();
  const eps = 0.00001;
  const radius = radius0 - eps;
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
  shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
  shape.absarc(
    width - radius * 2,
    height - radius * 2,
    eps,
    Math.PI / 2,
    0,
    true
  );
  shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);
  const geometry = new ExtrudeGeometry(shape, {
    depth: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness,
  });

  geometry.center();

  return geometry;
};
