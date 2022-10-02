import { Divider, Stack } from '@mui/material';
import { CarDashboard } from '../carDashboard';
import { ObjectList } from './object-list/ObjectList';
import React from 'react';

interface SidebarProps {
  onSelect: (value: ((prevState: string) => string) | string) => void;
  selected: string;
}

export function Sidebar(props: SidebarProps) {
  return (
    <Stack
      sx={{
        borderLeft: '1px solid',
        borderLeftColor: 'grey.300',
      }}
    >
      <CarDashboard />
      <Divider />
      <ObjectList onSelect={props.onSelect} selected={props.selected} />
    </Stack>
  );
}
