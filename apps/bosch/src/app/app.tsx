import React, { useEffect, useState } from 'react';
import {
  Box,
  createTheme,
  CssBaseline,
  MenuItem,
  Select,
  Stack,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { mainTheme } from '../theme/mainTheme';
import { View3D } from './components/View3D';
import { Simulation } from './Simulation';
import { ObjectList } from './components/object-list/ObjectList';
import { PlaybackControl } from './components/PlaybackControl';
import ReactPlayer from 'react-player';
import { HfdnDemo } from './components/HfdnDemo';

export const PlaybackContext = React.createContext<{
  isPlaying: boolean;
  speed: number;
}>({
  isPlaying: false,
  speed: 1,
});

export enum DatasetType {
  DATASET_1 = '15_17',
  DATASET_2 = '15_12',
  DATASET_3 = '14_49',
  DATASET_4 = '15_03',
}

const videos = [
  {
    dataset: DatasetType.DATASET_3,
    front: 'PSA_ADAS_W3_FC_2022-09-01_14-49_0054.mp4',
    rear: 'PSA_ADAS_W3_FC_2022-09-01_14-49_0054_Rear.mp4',
  },
  {
    dataset: DatasetType.DATASET_4,
    front: 'PSA_ADAS_W3_FC_2022-09-01_15-03_0057.mp4',
    rear: 'PSA_ADAS_W3_FC_2022-09-01_15-03_0057_Rear.mp4',
  },
  {
    dataset: DatasetType.DATASET_1,
    front: 'PSA_ADAS_W3_FC_2022-09-01_15-17_0060.mp4',
    rear: 'PSA_ADAS_W3_FC_2022-09-01_15-17_0060_Rear.mp4',
  },
  {
    dataset: DatasetType.DATASET_2,
    front: 'PSA_ADAS_W3_FC_2022-09-01_15-12_0059.mp4',
    rear: 'PSA_ADAS_W3_FC_2022-09-01_15-12_0059_Rear.mp4',
  },
];

const userViews = [
  {
    name: 'Object Tracking',
    value: 'object-tracking',
  },
  {
    name: 'Hfdn Demo',
    value: 'hfdn-demo',
  },
];

export const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedObjectId, setSelectedObjectId] = useState('');
  const trackedObjectList = Simulation.get().trackedObjects;
  const [dataset, setDataset] = useState(DatasetType.DATASET_3);
  const [length, setLength] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const [bufferTimestamp, setBufferTimestamp] = useState(0);
  const [userView, setUserView] = useState(userViews[1].value);

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
    simulation.on('step', () => {
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
                <MenuItem value={DatasetType.DATASET_1}>15_17</MenuItem>
                <MenuItem value={DatasetType.DATASET_2}>15_12</MenuItem>
                <MenuItem value={DatasetType.DATASET_3}>14_49</MenuItem>
                <MenuItem value={DatasetType.DATASET_4}>15_03</MenuItem>
              </Select>
              <ToggleButtonGroup
                color="primary"
                value={userView}
                exclusive
                onChange={(event, value) => {
                  setUserView(value);
                }}
                aria-label="Platform"
              >
                {userViews.map((view) => (
                  <ToggleButton
                    key={view.value}
                    value={view.value}
                    aria-label={view.value}
                  >
                    {view.name}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
            <Box
              component={'div'}
              sx={{ position: 'relative', height: '100%' }}
            >
              {userView === 'object-tracking' && (
                <>
                  <View3D
                    onSelect={setSelectedObjectId}
                    data={trackedObjectList}
                    selected={selectedObjectId}
                  />
                  <Stack
                    direction="row"
                    component={'div'}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      zIndex: 100,
                      width: '30vw',
                    }}
                  >
                    <ReactPlayer
                      className="react-player"
                      url={`http://anton.sch.bme.hu:3000/${
                        videos.find((v) => v.dataset === dataset)?.front
                      }`}
                      onError={(e) => console.error(e)}
                      playing={isPlaying}
                      playbackRate={playbackSpeed}
                      width="100%"
                      height="100%"
                    />
                    <ReactPlayer
                      className="react-player"
                      url={`http://anton.sch.bme.hu:3000/${
                        videos.find((v) => v.dataset === dataset)?.rear
                      }`}
                      onError={(e) => console.error(e)}
                      playing={isPlaying}
                      playbackRate={playbackSpeed}
                      width="100%"
                      height="100%"
                    />
                  </Stack>
                </>
              )}
              {userView === 'hfdn-demo' && <HfdnDemo isPlaying={true} />}
            </Box>
            <PlaybackControl
              length={length}
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
