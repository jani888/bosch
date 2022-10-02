import React, { useEffect, useState } from 'react';
import {
  Box,
  createTheme,
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { mainTheme } from '../theme/mainTheme';
import { View3D } from './components/View3D';
import { PlaybackControl } from './components/PlaybackControl';
import ReactPlayer from 'react-player';
import { HfdnDemo } from './components/HfdnDemo';
import './app.module.scss';
import { Sidebar } from './components/Sidebar';
import { Tutorial } from './components/tutorial/Tutorial';
import { useSimulation } from './hooks/useSimulation';
import { ObjectTrackingOptions } from './components/ObjectTrackingOptions';

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

function DatasetSelector(props: {
  onChange: (dataset: DatasetType) => void;
  value: DatasetType;
}) {
  return (
    <FormControl sx={{ height: '100%' }}>
      <InputLabel>Dataset</InputLabel>
      <Select
        id="dataset-selector"
        sx={{ height: '100%' }}
        size="medium"
        label="Dataset"
        onChange={(e) => props.onChange(e.target.value as DatasetType)}
        value={props.value}
      >
        <MenuItem value={DatasetType.DATASET_1}>15:17</MenuItem>
        <MenuItem value={DatasetType.DATASET_2}>15:12</MenuItem>
        <MenuItem value={DatasetType.DATASET_3}>14:49</MenuItem>
        <MenuItem value={DatasetType.DATASET_4}>15:03</MenuItem>
      </Select>
    </FormControl>
  );
}

function Logo() {
  return (
    <img
      src="https://hackathon.boschevent.hu/images/logo.svg"
      alt=""
      style={{ height: 46 }}
    />
  );
}

function ViewModeSelector(props: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <ToggleButtonGroup
      size="small"
      color="primary"
      value={props.value}
      exclusive
      onChange={(_, selected) => props.onChange(selected)}
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
  );
}

function VideoPlayer(props: {
  videoVisible: boolean;
  playing: boolean;
  playbackRate: number;
  dataset: DatasetType;
}) {
  return (
    <Stack
      direction="row"
      component="div"
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: props.videoVisible ? 100 : -1,
        width: '30vw',
      }}
    >
      <ReactPlayer
        className="react-player"
        url={`https://anton.sch.bme.hu/media/${
          videos.find((v) => v.dataset === props.dataset)?.front
        }`}
        playing={props.playing}
        playbackRate={props.playbackRate}
        width="100%"
        height="100%"
      />
      <ReactPlayer
        className="react-player"
        url={`https://anton.sch.bme.hu/media/${
          videos.find((v) => v.dataset === props.dataset)?.rear
        }`}
        playing={props.playing}
        playbackRate={props.playbackRate}
        width="100%"
        height="100%"
      />
    </Stack>
  );
}

export const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedObjectId, setSelectedObjectId] = useState('');
  const [videoVisible, setVideoVisible] = useState(true);
  const [dataset, setDataset] = useState(DatasetType.DATASET_3);
  const [userView, setUserView] = useState(userViews[0].value);
  const [showBlindSpots, setShowBlindSpots] = useState(true);
  const [showSensors, setShowSensors] = useState(false);
  const simulation = useSimulation();

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
  }, []);

  return (
    <ThemeProvider theme={createTheme(mainTheme)}>
      <CssBaseline />
      <Tutorial />
      <PlaybackContext.Provider value={{ isPlaying, speed: playbackSpeed }}>
        <Stack
          direction="row"
          sx={{
            height: '100vh',
            width: '100vw',
          }}
        >
          <Stack width="100%">
            <Stack
              py={2.25}
              px={3}
              direction="row"
              sx={{
                borderBottom: '1px solid',
                borderBottomColor: 'grey.300',
              }}
              gap={2}
            >
              <Logo />
              <DatasetSelector onChange={setDataset} value={dataset} />
              <ViewModeSelector value={userView} onChange={setUserView} />
              {userView === 'object-tracking' && (
                <ObjectTrackingOptions
                  showBlindSpots={showBlindSpots}
                  onShowBlindSpotsChange={setShowBlindSpots}
                  showSensors={showSensors}
                  onShowSensorsChange={setShowSensors}
                  onToggleVideo={() => setVideoVisible((v) => !v)}
                />
              )}
            </Stack>
            <Box
              component={'div'}
              sx={{ position: 'relative', height: '100%' }}
            >
              {userView === 'object-tracking' && (
                <>
                  <View3D
                    showBlindSpots={showBlindSpots}
                    showSensors={showSensors}
                    onSelect={setSelectedObjectId}
                    selected={selectedObjectId}
                  />
                  <VideoPlayer
                    dataset={dataset}
                    videoVisible={videoVisible}
                    playing={isPlaying}
                    playbackRate={playbackSpeed}
                  />
                </>
              )}
              {userView === 'hfdn-demo' && <HfdnDemo isPlaying={true} />}
            </Box>
            <PlaybackControl
              onTogglePlayback={() => simulation.togglePlaying()}
              onSpeedChange={(speed) => simulation.changePlaybackSpeed(speed)}
            />
          </Stack>
          <Sidebar onSelect={setSelectedObjectId} selected={selectedObjectId} />
        </Stack>
      </PlaybackContext.Provider>
    </ThemeProvider>
  );
};

export default App;
