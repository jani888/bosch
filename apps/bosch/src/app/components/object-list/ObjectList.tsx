import { Box, Divider, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ObjectListItem } from './ObjectListItem';
import { TrackedObject } from '../../TrackedObject';
import { Chart } from 'react-charts';
import { Simulation } from '../../Simulation';

interface ObjectCountChartData {
  timestamp: Date;
  count: number;
}

export function ObjectList({
  data,
  selected,
  onSelect,
}: {
  data: TrackedObject[];
  selected: string;
  onSelect: (uuid: string) => void;
}) {
  const [chartData, setChartData] = useState<ObjectCountChartData[]>([]);
  const [uniqueTracking, setUniqueTracking] = useState<ObjectCountChartData[]>(
    []
  );
  useEffect(() => {
    setChartData((v) =>
      v.concat({ timestamp: new Date(), count: data.length })
    );
    setUniqueTracking((v) =>
      v.concat({
        timestamp: new Date(),
        count: Simulation.get().uniqueTrackings,
      })
    );
  }, [data]);

  return (
    <Stack gap={1} width={300} p={3} sx={{ minHeight: 0, height: '100%' }}>
      <Typography variant="h5">Tracked objects</Typography>

      <Box
        component="div"
        sx={{ height: '30%', overflow: 'hidden', flexShrink: 0 }}
      >
        <Chart<ObjectCountChartData>
          style={{ position: 'fixed' }}
          options={{
            data: [
              { label: 'Object count', data: chartData },
              { label: 'Unique trackings', data: uniqueTracking },
            ],
            primaryAxis: {
              scaleType: 'time',
              getValue(v) {
                return v.timestamp;
              },
            },
            secondaryAxes: [
              {
                getValue(v) {
                  return v.count;
                },
                scaleType: 'linear',
              },
            ],
          }}
        />
      </Box>

      <Stack sx={{ overflow: 'auto' }}>
        {data.map((trackedObject) => (
          <ObjectListItem
            selected={selected === trackedObject.uuid}
            onSelect={onSelect}
            key={trackedObject.uuid}
            trackedObject={trackedObject}
          />
        ))}
      </Stack>
    </Stack>
  );
}
