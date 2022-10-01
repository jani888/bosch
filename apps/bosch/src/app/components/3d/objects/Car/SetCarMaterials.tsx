/* eslint-disable @typescript-eslint/ban-ts-comment*/
// @ts-nocheck
import {
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
} from 'three';
import { makeMaterialsTransparent } from '../Custom3dHelpers';

export function setMaterials(
  carModel: Object3D,
  color: string,
  opacity: number
) {
  carModel.traverse((o) => {
    if (o.isMesh) {
      console.log(o.name);
    }
  });
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

  const interialMaterial = new MeshStandardMaterial({
    color: 0x737a80,
    metalness: 0.5,
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

  carModel.getObjectByName('interior_light').material = interialMaterial;
  carModel.getObjectByName('yellow_trim').material = bodyMaterial;
  carModel.getObjectByName('body').material = bodyMaterial;
  carModel.getObjectByName('rim_fl').material = detailsMaterial;
  carModel.getObjectByName('rim_fr').material = detailsMaterial;
  carModel.getObjectByName('rim_rr').material = detailsMaterial;
  carModel.getObjectByName('rim_rl').material = detailsMaterial;
  carModel.getObjectByName('trim').material = detailsMaterial;
  carModel.getObjectByName('centre').material = detailsMaterial;
  carModel.getObjectByName('centre_1').material = detailsMaterial;
  carModel.getObjectByName('centre_2').material = detailsMaterial;
  carModel.getObjectByName('centre_3').material = detailsMaterial;
  carModel.getObjectByName('glass').material = glassMaterial;

  makeMaterialsTransparent(carModel, color, opacity);
}
