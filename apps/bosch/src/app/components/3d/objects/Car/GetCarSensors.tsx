import { CameraHelper, PerspectiveCamera } from 'three';

export function getCarSensors() {
  //Angles are in degrees
  //Position is in millimeters
  const sensorPositions: {
    name: string;
    x: number;
    y: number;
    z: number;
    elevation_angle: number;
    azimuth_angle: number;
  }[] = [
    {
      name: 'left-front',
      x: 3.4738,
      y: 0.6286,
      z: 0.5156,
      elevation_angle: 0,
      azimuth_angle: 42,
    },
    {
      name: 'left-rear',
      x: -0.7664,
      y: 0.738,
      z: 0.7359,
      elevation_angle: 0.48,
      azimuth_angle: 135,
    },
    {
      name: 'right-front',
      x: 3.4738,
      y: -0.6286,
      z: 0.5156,
      elevation_angle: 0,
      azimuth_angle: -42,
    },
    {
      name: 'right-rear',
      x: -0.7664,
      y: -0.738,
      z: 0.7359,
      elevation_angle: 0.48,
      azimuth_angle: -135,
    },
  ];

  return sensorPositions.map((sensorPos) => {
    const camera = new PerspectiveCamera(80, 2, 2, 10);
    const camHelper = new CameraHelper(camera);

    camera.position.set(sensorPos.y, sensorPos.z, sensorPos.x);
    camera.rotation.set(
      (sensorPos.elevation_angle * Math.PI) / 180,
      Math.PI + (sensorPos.azimuth_angle * Math.PI) / 180,
      0
    );
    return {
      name: sensorPos.name,
      camera,
      helper: camHelper,
    };
  });
}
