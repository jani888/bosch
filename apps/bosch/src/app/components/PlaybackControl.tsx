import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import {
  Button,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import React, { useEffect, useState } from 'react';
import { Simulation } from '../Simulation';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';

export function PlaybackControl({
  onTogglePlayback,
  onSpeedChange,
}: {
  speed: number;
  isPlaying: boolean;
  onTogglePlayback: () => void;
  onSpeedChange: (speed: number) => void;
  length: number;
}) {
  const [current, setCurrent] = useState<number>(0);
  const [buffer, setBuffer] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [length, setLength] = useState(0);

  useEffect(() => {
    const simulation = Simulation.get();
    simulation.on('playingChanged', (playing: boolean) => {
      setIsPlaying(playing);
    });
    simulation.on('playbackSpeedChanged', (speed: number) => {
      setSpeed(speed);
    });
    simulation.on('lengthChanged', (length: number) => {
      setLength(length);
    });
    simulation.on('chunkLoaded', () => {
      setBuffer(simulation.bufferTimestamp);
    });
    simulation.on('step', () => {
      setCurrent(simulation.currentTimestamp);
    });
  }, []);
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' });
  return (
    <Stack
      id="playback-control"
      direction="row"
      p={1}
      sx={{
        alignItems: 'center',
        backgroundColor: 'grey.200',
        borderTop: '1px solid',
        borderColor: 'grey.500',
      }}
    >
      <Button
        startIcon={<SlowMotionVideoIcon />}
        id="speed-selector"
        size="small"
        variant="text"
        color="primary"
        {...bindTrigger(popupState)}
      >
        {speed}x
      </Button>
      <Menu {...bindMenu(popupState)}>
        <MenuItem
          onClick={() => {
            popupState.close();
            onSpeedChange(0.1);
          }}
        >
          0.1x
        </MenuItem>
        <MenuItem
          onClick={() => {
            popupState.close();
            onSpeedChange(0.5);
          }}
        >
          0.5x
        </MenuItem>
        <MenuItem
          onClick={() => {
            popupState.close();
            onSpeedChange(1);
          }}
        >
          1x
        </MenuItem>
        <MenuItem
          onClick={() => {
            popupState.close();
            onSpeedChange(1.5);
          }}
        >
          1.5x
        </MenuItem>
      </Menu>
      <IconButton
        id="play-button"
        sx={{ mr: 2 }}
        color="primary"
        onClick={onTogglePlayback}
      >
        {!isPlaying ? <PlayArrowIcon /> : <PauseIcon />}
      </IconButton>
      <Typography mr={2} color="primary">
        {(current / 100).toFixed(2)}s
      </Typography>
      <LinearProgress
        sx={{ width: '100%' }}
        value={(current / length) * 100}
        valueBuffer={(buffer / length) * 100}
        variant="buffer"
      />
    </Stack>
  );
}
