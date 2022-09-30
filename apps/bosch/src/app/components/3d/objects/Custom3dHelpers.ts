import { Mesh, MeshPhysicalMaterial, Object3D } from 'three';

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
