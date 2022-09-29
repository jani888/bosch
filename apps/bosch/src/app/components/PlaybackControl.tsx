import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import { Button, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import React from 'react';

export function PlaybackControl({
  isPlaying,
  onTogglePlayback,
  speed,
  onSpeedChange,
}: {
  speed: number;
  isPlaying: boolean;
  onTogglePlayback: () => void;
  onSpeedChange: (speed: number) => void;
}) {
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' });
  return (
    <Stack direction="row" p={1} sx={{ backgroundColor: 'info.light' }}>
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
      <IconButton color="primary" onClick={onTogglePlayback}>
        {!isPlaying ? <PlayArrowIcon /> : <PauseIcon />}
      </IconButton>
    </Stack>
  );
}
