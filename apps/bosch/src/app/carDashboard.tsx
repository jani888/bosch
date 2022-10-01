import { Stack, Typography } from '@mui/material';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import { useEffect, useMemo, useState } from 'react';
import { Simulation } from './Simulation';

export function CarDashboard() {
  const [leftBlindSpot, setLeftBlindSpot] = useState(false);
  const [rightBlindSpot, setRightBlindSpot] = useState(false);
  const [speed, setSpeed] = useState(0);
  const simulation = useMemo(() => Simulation.get(), []);
  useEffect(() => {
    const listener = () => {
      console.log('blindSpotChange');
      setLeftBlindSpot(simulation.leftBlindSpot);
      setRightBlindSpot(simulation.rightBlindSpot);
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
      direction="row"
      justifyContent="space-evenly"
      alignItems="center"
      py={2}
      px={4}
    >
      <WarningAmberOutlinedIcon
        fontSize="large"
        className={leftBlindSpot ? 'warning-blink' : 'no-blink'}
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
        className={rightBlindSpot ? 'warning-blink' : 'no-blink'}
      />
    </Stack>
  );
}
