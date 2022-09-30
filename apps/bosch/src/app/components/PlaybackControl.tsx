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
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import React from 'react';

export function PlaybackControl({
  isPlaying,
  onTogglePlayback,
  speed,
  onSpeedChange,
  length,
  current,
  buffer,
}: {
  speed: number;
  isPlaying: boolean;
  onTogglePlayback: () => void;
  onSpeedChange: (speed: number) => void;
  length: number;
  current: number;
  buffer: number;
}) {
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' });
  return (
    <Stack
      direction="row"
      p={1}
      sx={{
        alignItems: 'center',
        backgroundColor: 'grey.200',
        borderTop: '1px solid',
        borderColor: 'grey.500',
      }}
    >
      {current.toFixed(0)}
      <Button
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
            onSpeedChange(0.001);
          }}
        >
          0.001x
        </MenuItem>
        <MenuItem
          onClick={() => {
            popupState.close();
            onSpeedChange(0.01);
          }}
        >
          0.01x
        </MenuItem>
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
            onSpeedChange(2);
          }}
        >
          2x
        </MenuItem>
        <MenuItem
          onClick={() => {
            popupState.close();
            onSpeedChange(3);
          }}
        >
          3x
        </MenuItem>
      </Menu>
      <IconButton sx={{ mr: 2 }} color="primary" onClick={onTogglePlayback}>
        {!isPlaying ? <PlayArrowIcon /> : <PauseIcon />}
      </IconButton>
      <LinearProgress
        sx={{ width: '100%' }}
        value={(current / length) * 100}
        valueBuffer={(buffer / length) * 100}
        variant="buffer"
      />
    </Stack>
  );
}
