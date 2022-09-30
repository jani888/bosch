import { ObjectType } from '../View3D';
import { Box } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import React from 'react';

export function ObjectTypeIcon({ type }: { type: ObjectType }) {
  return (
    <>
      {type === ObjectType.Unknown && <HelpIcon sx={{ color: 'grey.400' }} />}
      {type === ObjectType.Pedestrian && (
        <AccessibilityIcon sx={{ color: 'grey.400' }} />
      )}
      {type === ObjectType.Cyclist && (
        <DirectionsBikeIcon sx={{ color: 'grey.400' }} />
      )}
      {type === ObjectType.Car && (
        <DirectionsCarIcon sx={{ color: 'grey.400' }} />
      )}
    </>
  );
}
