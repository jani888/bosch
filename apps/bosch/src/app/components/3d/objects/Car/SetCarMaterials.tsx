/* eslint-disable @typescript-eslint/ban-ts-comment*/
// @ts-nocheck
import { MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';

export function setMaterials(carModel: Object3D) {
  const bodyMaterial = new MeshPhysicalMaterial({
    color: 0xff6f00,
    metalness: 1.0,
    roughness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    sheen: 0.5,
  });

  const detailsMaterial = new MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.5,
  });

  const glassMaterial = new MeshPhysicalMaterial({
    color: 0xffffff,
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
}
