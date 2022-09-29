import { Stack, Typography } from '@mui/material';
import React from 'react';
import { TrackedObject } from '../View3D';
import { ObjectListItem } from './ObjectListItem';

export function ObjectList({ data }: { data: TrackedObject[] }) {
  return (
    <Stack gap={1} width={300} p={3}>
      <Typography variant="h5">Tracked objects</Typography>
      {data.map((trackedObject) => (
        <ObjectListItem
          key={trackedObject.uuid}
          trackedObject={trackedObject}
        />
      ))}
    </Stack>
  );
}
