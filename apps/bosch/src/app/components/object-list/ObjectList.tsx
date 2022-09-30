import { Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import { ObjectListItem } from './ObjectListItem';
import { TrackedObject } from '../../TrackedObject';

export function ObjectList({
  data,
  selected,
  onSelect,
}: {
  data: TrackedObject[];
  selected: string;
  onSelect: (uuid: string) => void;
}) {
  return (
    <Stack gap={1} width={300} p={3}>
      <Typography variant="h5">Tracked objects</Typography>

      {data.map((trackedObject) => (
        <ObjectListItem
          selected={selected === trackedObject.uuid}
          onSelect={onSelect}
          key={trackedObject.uuid}
          trackedObject={trackedObject}
        />
      ))}
    </Stack>
  );
}
