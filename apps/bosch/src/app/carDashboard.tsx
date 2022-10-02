import { Stack, Typography } from '@mui/material';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { Simulation } from './Simulation';
import { TrackedObject } from './TrackedObject';
import { ObjectTypeIcon } from './components/object-list/ObjectTypeIcon';
import { useSimulation } from './hooks/useSimulation';

export function CarDashboard() {
  const [audio] = useState(new Audio('assets/notification_sound.mp3'));
  const [leftBlindSpot, setLeftBlindSpot] = useState<TrackedObject[]>([]);
  const [rightBlindSpot, setRightBlindSpot] = useState<TrackedObject[]>([]);
  const [speed, setSpeed] = useState(0);
  const simulation = useSimulation();
  useEffect(() => {
    const listener = () => {
      if (
        simulation.leftBlindSpot.length > 0 ||
        simulation.rightBlindSpot.length > 0
      ) {
        audio?.play();
      }
      if (simulation.leftBlindSpot.length === 0) {
        setTimeout(() => setLeftBlindSpot([]), 1500);
      } else {
        setLeftBlindSpot(simulation.leftBlindSpot);
      }
      if (simulation.rightBlindSpot.length === 0) {
        setTimeout(() => setRightBlindSpot([]), 1500);
      } else {
        setRightBlindSpot(simulation.rightBlindSpot);
      }
    };
    const interval = setInterval(() => {
      setSpeed(simulation.carSpeed * 3.6);
    }, 300);
    simulation.on('blindSpotChange', listener);
    return () => {
      simulation.off('blindSpotChange', listener);
      clearInterval(interval);
    };
  }, [simulation]);
  return (
    <Stack
      id="dashboard"
      direction="row"
      justifyContent="space-evenly"
      alignItems="center"
      py={2}
      px={4}
    >
      {leftBlindSpot.length > 0 && (
        <ObjectTypeIcon type={leftBlindSpot[0].type} />
      )}
      <WarningAmberOutlinedIcon
        fontSize="large"
        className={leftBlindSpot.length > 0 ? 'warning-blink' : 'no-blink'}
      />

      <Stack alignItems="center">
        <SpeedOutlinedIcon sx={{ fontSize: 15, color: 'grey.600' }} />
        <Typography color="grey.700" fontSize={16} fontWeight={700} px={2}>
          {speed.toFixed(0)} km/h
        </Typography>
        <Typography variant="caption" fontSize={8}>
          SPEED
        </Typography>
      </Stack>

      <WarningAmberOutlinedIcon
        fontSize="large"
        className={rightBlindSpot.length > 0 ? 'warning-blink' : 'no-blink'}
      />
      {rightBlindSpot.length > 0 && (
        <ObjectTypeIcon type={rightBlindSpot[0].type} />
      )}
    </Stack>
  );
}
