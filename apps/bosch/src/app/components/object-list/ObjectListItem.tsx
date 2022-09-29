import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import React from 'react';
import PlaceIcon from '@mui/icons-material/Place';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { ObjectTypeIcon } from './ObjectTypeIcon';
import { TrackedObject } from '../../simulation';

export function ObjectListItem(props: {
  trackedObject: TrackedObject;
  selected: boolean;
  onSelect: (uuid: string) => void;
}) {
  return (
    <Card
      variant="outlined"
      sx={{ borderColor: props.selected ? 'primary.main' : '' }}
      onClick={() => props.onSelect(props.trackedObject.uuid)}
    >
      <Box component="div" sx={{ py: 1, px: 2 }}>
        <Stack direction="row">
          <Stack direction="column">
            <Typography
              variant="caption"
              fontWeight={700}
              fontSize={10}
              color="grey.500"
            >
              {props.trackedObject.uuid}
            </Typography>
            <Stack direction="row" alignItems="center">
              <PlaceIcon sx={{ width: 14, height: 14, color: 'grey.500' }} />
              <Typography fontSize={12}>
                x: {props.trackedObject.x.toFixed(2)} y:{' '}
                {props.trackedObject.y.toFixed(2)}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center">
              <TipsAndUpdatesIcon
                sx={{ width: 14, height: 14, color: 'grey.500' }}
              />
              <Typography fontSize={12}>
                x: {props.trackedObject.prediction.x.toFixed(2)} y:{' '}
                {props.trackedObject.prediction.y.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>
          <ObjectTypeIcon type={props.trackedObject.type} />
        </Stack>
      </Box>
    </Card>
  );
}
