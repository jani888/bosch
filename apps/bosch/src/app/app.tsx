import React, { useEffect, useState } from 'react';
import {
  Box,
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
import ReactPlayer from 'react-player';

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

const videos = [
  'PSA_ADAS_W3_FC_2022-09-01_14-49_0054.mp4',
  'PSA_ADAS_W3_FC_2022-09-01_14-49_0054_Rear.mp4',
  'PSA_ADAS_W3_FC_2022-09-01_15-03_0057.mp4',
  'PSA_ADAS_W3_FC_2022-09-01_15-03_0057_Rear.mp4',
  'PSA_ADAS_W3_FC_2022-09-01_15-12_0059.mp4',
  'PSA_ADAS_W3_FC_2022-09-01_15-12_0059_Rear.mp4',
  'PSA_ADAS_W3_FC_2022-09-01_15-17_0060.mp4',
  'PSA_ADAS_W3_FC_2022-09-01_15-17_0060_Rear.mp4',
];

export const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedObjectId, setSelectedObjectId] = useState('');
  const trackedObjectList = Simulation.get().trackedObjects;
  const [dataset, setDataset] = useState(DatasetType.DATASET_1);
  const [video, setVideo] = useState(videos[0]);
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
            <Stack direction="row" gap={2}>
              <Select
                onChange={(e) => setDataset(e.target.value as DatasetType)}
                value={dataset}
              >
                <MenuItem value={DatasetType.DATASET_1}>Dataset 1</MenuItem>
              </Select>
              <Select
                onChange={(e) => setVideo(e.target.value as string)}
                value={video}
              >
                {videos.map((video) => (
                  <MenuItem value={video}>{video}</MenuItem>
                ))}
              </Select>
            </Stack>
            <Box
              component={'div'}
              sx={{ position: 'relative', height: '100%' }}
            >
              <View3D data={trackedObjectList} selected={selectedObjectId} />
              <Box
                component={'div'}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  zIndex: 100,
                  width: '30vw',
                }}
              >
                <ReactPlayer
                  className="react-player"
                  url={`http://anton.sch.bme.hu:3000/${video}`}
                  onError={(e) => console.error(e)}
                  playing={isPlaying}
                  playbackRate={playbackSpeed}
                  width="100%"
                  height="100%"
                />
              </Box>
            </Box>

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
