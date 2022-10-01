import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  createTheme,
  CssBaseline,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { mainTheme } from '../theme/mainTheme';
import { View3D } from './components/View3D';
import { Simulation } from './Simulation';
import { ObjectList } from './components/object-list/ObjectList';
import { PlaybackControl } from './components/PlaybackControl';
import ReactPlayer from 'react-player';
import { HfdnDemo } from './components/HfdnDemo';
import { CarDashboard } from './carDashboard';
import './app.module.scss';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Walktour } from 'walktour';
import { WalktourFooter } from './components/tutorial/WalktourFooter';

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
  const [videoVisible, setVideoVisible] = useState(true);
  const [dataset, setDataset] = useState(DatasetType.DATASET_3);
  const [length, setLength] = useState(0);
  const [userView, setUserView] = useState(userViews[0].value);
  const [showBlindSpots, setShowBlindSpots] = useState(true);
  const [showSensors, setShowSensors] = useState(false);

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
  }, []);

  return (
    <ThemeProvider theme={createTheme(mainTheme)}>
      <CssBaseline />
      <Walktour
        disableClose
        allowForeignTarget={false}
        customTitleRenderer={(title) => (
          <Typography variant="h5" fontWeight="bold">
            {title}
          </Typography>
        )}
        customFooterRenderer={(tourLogic) => (
          <WalktourFooter
            tourLogic={tourLogic}
            onSkip={() => tourLogic?.close()}
            onNext={() => tourLogic?.next()}
          />
        )}
        steps={[
          {
            selector: '#app',
            title: 'Welcome to our Code #LikeABosch demo',
            description:
              'This is a demo of our solution for the Bosch Code #LikeABosch software challenge',
          },
          {
            selector: '#dataset-selector',
            title: 'Choose the dataset',
            description: 'First of all, choose the dataset you want to use',
          },
          {
            selector: '#video-toggle',
            title: 'Toggle video visibility',
            description: "If you don't want to see the video, you can hide it",
          },
          {
            selector: '#playback-control',
            title: 'Playback control',
            description: 'You can control the simulation here',
          },
          {
            selector: '#speed-selector',
            title: 'Select the simulation speed',
            description:
              'You can change the simulation speed with this dropdown. 1x means 1 second in the simulation is 1 second in real time',
          },
          {
            selector: '#play-button',
            title: 'Start the simulation',
            description: 'You can start the simulation with this button',
          },
          {
            selector: '#dashboard',
            title: 'Car dashboard',
            description:
              "Here you can see the car's speed and the left and right blind spot sensors. These sensors will blink, when something is in the blind spot.",
          },
          {
            selector: '#object-list',
            title: 'Select an object',
            description:
              'You can select an object from the list to see its details',
            closeLabel: 'Okay, got it',
          },
        ]}
      />
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
              <img
                src="https://hackathon.boschevent.hu/images/logo.svg"
                alt=""
                style={{ height: 46 }}
              />
              <FormControl sx={{ height: '100%' }}>
                <InputLabel>Dataset</InputLabel>
                <Select
                  id="dataset-selector"
                  sx={{ height: '100%' }}
                  size="medium"
                  label="Dataset"
                  onChange={(e) => setDataset(e.target.value as DatasetType)}
                  value={dataset}
                >
                  <MenuItem value={DatasetType.DATASET_1}>15:17</MenuItem>
                  <MenuItem value={DatasetType.DATASET_2}>15:12</MenuItem>
                  <MenuItem value={DatasetType.DATASET_3}>14:49</MenuItem>
                  <MenuItem value={DatasetType.DATASET_4}>15:03</MenuItem>
                </Select>
              </FormControl>
              <ToggleButtonGroup
                size="small"
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
              {userView === 'object-tracking' && (
                <Stack direction="row" ml="auto">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showBlindSpots}
                        onChange={(_, v) => setShowBlindSpots(v)}
                        defaultChecked
                      />
                    }
                    label="Show blind spots"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showSensors}
                        onChange={(_, v) => setShowSensors(v)}
                        defaultChecked
                      />
                    }
                    label="Show sensors"
                  />
                  <Tooltip title="Toggle video">
                    <Button
                      id="video-toggle"
                      startIcon={<PhotoCameraIcon />}
                      onClick={() => setVideoVisible((v) => !v)}
                    >
                      Toggle Video
                    </Button>
                  </Tooltip>
                </Stack>
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
                  <Stack
                    direction="row"
                    component="div"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      zIndex: videoVisible ? 100 : -1,
                      width: '30vw',
                    }}
                  >
                    <ReactPlayer
                      className="react-player"
                      url={`https://anton.sch.bme.hu/media/${
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
                      url={`https://anton.sch.bme.hu/media/${
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
              speed={playbackSpeed}
              isPlaying={isPlaying}
              onTogglePlayback={() => simulation.togglePlaying()}
              onSpeedChange={(speed) => simulation.changePlaybackSpeed(speed)}
            />
          </Stack>
          <Stack
            sx={{
              borderLeft: '1px solid',
              borderLeftColor: 'grey.300',
            }}
          >
            <CarDashboard />
            <Divider />
            <ObjectList
              onSelect={setSelectedObjectId}
              selected={selectedObjectId}
            />
          </Stack>
        </Stack>
      </PlaybackContext.Provider>
    </ThemeProvider>
  );
};

export default App;
