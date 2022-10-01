import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
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
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (uuid: string) => void;
}) {
  const [data, setData] = useState<TrackedObject[]>([]);
  useEffect(() => {
    const listener = () => {
      setData(Simulation.get().trackedObjects);
    };
    const interval = setInterval(listener, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
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
    <Stack
      gap={1}
      width={300}
      p={3}
      sx={{ minHeight: 0, height: '100%' }}
      id="object-list"
    >
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

      <Stack gap={1} sx={{ overflow: 'auto' }}>
        {selected && (
          <Stack mb={1}>
            <Typography
              textAlign="center"
              variant="subtitle2"
              fontWeight="bold"
              fontSize={11}
              color="grey.300"
            >
              LEGEND
            </Typography>
            <Stack gap={1} direction="row">
              <Chip
                label="Measurement"
                sx={{
                  width: '100%',
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontWeight: 700,
                }}
              />
              <Chip
                label="Prediction"
                sx={{
                  width: '100%',
                  backgroundColor: 'info.main',
                  color: 'white',
                  fontWeight: 700,
                }}
              />
            </Stack>
          </Stack>
        )}
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
