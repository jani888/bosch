import {
  Button,
  FormControlLabel,
  Stack,
  Switch,
  Tooltip,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import React from 'react';

interface ObjectTrackingOptionsProps {
  showBlindSpots: boolean;
  onShowBlindSpotsChange: (v: boolean) => void;
  showSensors: boolean;
  onShowSensorsChange: (v: boolean) => void;
  onToggleVideo: () => void;
}

export function ObjectTrackingOptions({
  showBlindSpots,
  onShowBlindSpotsChange,
  showSensors,
  onShowSensorsChange,
  onToggleVideo,
}: ObjectTrackingOptionsProps) {
  return (
    <Stack direction="row" ml="auto">
      <FormControlLabel
        control={
          <Switch
            checked={showBlindSpots}
            onChange={(_, v) => onShowBlindSpotsChange(v)}
          />
        }
        label="Show blind spots"
      />
      <FormControlLabel
        control={
          <Switch
            checked={showSensors}
            onChange={(_, v) => onShowSensorsChange(v)}
          />
        }
        label="Show sensors"
      />
      <Tooltip title="Toggle video">
        <Button
          id="video-toggle"
          startIcon={<PhotoCameraIcon />}
          onClick={onToggleVideo}
        >
          Toggle Video
        </Button>
      </Tooltip>
    </Stack>
  );
}
