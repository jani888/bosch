import { ObjectType } from '../View3D';
import { Box } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import React from 'react';
import { RawObjectType } from '@bosch/api-interfaces';

export function ObjectTypeIcon({ type }: { type: RawObjectType }) {
  return (
    <>
      {type === RawObjectType.NO_DETECTION && (
        <HelpIcon sx={{ color: 'grey.400' }} />
      )}
      {type === RawObjectType.PEDESTRIAN && (
        <AccessibilityIcon sx={{ color: 'grey.400' }} />
      )}
      {type === RawObjectType.BICYCLE && (
        <DirectionsBikeIcon sx={{ color: 'grey.400' }} />
      )}
      {type === RawObjectType.CAR && (
        <DirectionsCarIcon sx={{ color: 'grey.400' }} />
      )}
    </>
  );
}
