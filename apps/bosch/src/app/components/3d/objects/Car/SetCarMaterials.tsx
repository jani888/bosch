/* eslint-disable @typescript-eslint/ban-ts-comment*/
// @ts-nocheck
import {
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
} from 'three';

export function setMaterials(
  carModel: Object3D,
  color: string,
  opacity: number
) {
  const bodyMaterial = new MeshPhysicalMaterial({
    color: color,
    opacity: opacity,
    transparent: opacity < 1,
    metalness: 1.0,
    roughness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    sheen: 0.5,
  });

  const detailsMaterial = new MeshStandardMaterial({
    color: 0xffffff,
    opacity: opacity,
    transparent: opacity < 1,
    metalness: 1.0,
    roughness: 0.5,
  });

  const glassMaterial = new MeshPhysicalMaterial({
    color: 0xffffff,
    opacity: opacity,
    transparent: opacity < 1,
    metalness: 0.25,
    roughness: 0,
    transmission: 1.0,
  });

  carModel.getObjectByName('body').material = bodyMaterial;
  carModel.getObjectByName('rim_fl').material = detailsMaterial;
  carModel.getObjectByName('rim_fr').material = detailsMaterial;
  carModel.getObjectByName('rim_rr').material = detailsMaterial;
  carModel.getObjectByName('rim_rl').material = detailsMaterial;
  carModel.getObjectByName('trim').material = detailsMaterial;
  carModel.getObjectByName('glass').material = glassMaterial;

  carModel.traverse((object) => {
    if (object instanceof Mesh) {
      object.material.opacity = opacity;
      object.material.transparent = opacity < 1;
    }
  });
}
