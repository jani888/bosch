import React, { useEffect, useState } from 'react';
import {
  createTheme,
  CssBaseline,
  MenuItem,
  Select,
  Stack,
  ThemeProvider,
} from '@mui/material';
import { mainTheme } from '../theme/mainTheme';
import { View3D } from './components/View3D';
import { Simulation } from './Simulation';
import { ObjectList } from './components/object-list/ObjectList';
import { PlaybackControl } from './components/PlaybackControl';

export const PlaybackContext = React.createContext<{
  isPlaying: boolean;
  speed: number;
}>({
  isPlaying: false,
  speed: 1,
});

export enum DatasetType {
  DATASET_1 = 'dataset1',
}

export const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedObjectId, setSelectedObjectId] = useState('');
  const trackedObjectList = Simulation.get().trackedObjects;
  const [dataset, setDataset] = useState(DatasetType.DATASET_1);
  const [length, setLength] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const [bufferTimestamp, setBufferTimestamp] = useState(0);

  const simulation = Simulation.get();
  useEffect(() => {
    simulation.changeDataset(dataset);
  }, [dataset]);

  useEffect(() => {
    simulation.on('playingChanged', (playing: boolean) => {
      setIsPlaying(playing);
    });
    simulation.on('playbackSpeedChanged', (speed: number) => {
      setPlaybackSpeed(speed);
    });
    simulation.on('lengthChanged', (length: number) => {
      setLength(length);
    });
    simulation.on('chunkLoaded', () => {
      setBufferTimestamp(simulation.bufferTimestamp);
    });
    simulation.on('step', (dt: number) => {
      setTimestamp(simulation.currentTimestamp);
    });
  }, []);

  //
  // function simulate(time: number) {
  //   frame.current++;
  //   requestRef.current = requestAnimationFrame(simulate);
  //   const dt = time - previousTimeRef.current;
  //   previousTimeRef.current = time;
  //   if (frame.current % ((4 - playbackSpeed) * 10) === 0) {
  //     //step(dt, time);
  //   }
  // }

  return (
    <ThemeProvider theme={createTheme(mainTheme)}>
      <CssBaseline />
      <PlaybackContext.Provider value={{ isPlaying, speed: playbackSpeed }}>
        <Stack
          direction="row"
          sx={{
            height: '100vh',
            width: '100vw',
          }}
        >
          <Stack width="100%">
            <Stack direction="row">
              <Select
                onChange={(e) => setDataset(e.target.value as DatasetType)}
                value={dataset}
              >
                <MenuItem value={DatasetType.DATASET_1}>Dataset 1</MenuItem>
              </Select>
            </Stack>
            <View3D data={trackedObjectList} selected={selectedObjectId} />
            <PlaybackControl
              length={length + 1000000}
              current={timestamp}
              buffer={bufferTimestamp}
              speed={playbackSpeed}
              isPlaying={isPlaying}
              onTogglePlayback={() => simulation.togglePlaying()}
              onSpeedChange={(speed) => simulation.changePlaybackSpeed(speed)}
            />
          </Stack>
          <ObjectList
            onSelect={setSelectedObjectId}
            selected={selectedObjectId}
            data={trackedObjectList}
          />
        </Stack>
      </PlaybackContext.Provider>
    </ThemeProvider>
  );
};

export default App;
