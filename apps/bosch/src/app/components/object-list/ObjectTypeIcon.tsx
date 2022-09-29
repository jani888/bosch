import { ObjectType } from '../View3D';
import { Box } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import React from 'react';

export function ObjectTypeIcon({ type }: { type: ObjectType }) {
  return (
    <Box component="div" sx={{ ml: 'auto', mt: 'auto', color: 'grey.400' }}>
      {type === ObjectType.Unknown && <HelpIcon />}
      {type === ObjectType.Pedestrian && <AccessibilityIcon />}
      {type === ObjectType.Cyclist && <DirectionsBikeIcon />}
      {type === ObjectType.Car && <DirectionsCarIcon />}
    </Box>
  );
}
