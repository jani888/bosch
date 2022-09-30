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
import { RawMeasurement, step, TrackedObject } from './simulation';
import { ObjectList } from './components/object-list/ObjectList';
import { useTrackedObjectList } from './hooks/useTrackedObjectList';
import { PlaybackControl } from './components/PlaybackControl';
import { EventEmitter } from 'events';

export const PlaybackContext = React.createContext<{
  isPlaying: boolean;
  speed: number;
}>({
  isPlaying: false,
  speed: 1,
});

type ApiResponse = {
  data: RawMeasurement[];
};

export enum DatasetType {
  DATASET_1 = 'dataset1',
}

export class Simulation extends EventEmitter {
  private static instance: Simulation;
  private dataset: DatasetType = DatasetType.DATASET_1;
  public currentTimestamp = 0;
  private data: RawMeasurement[] = [];
  private playing = false;
  private playbackSpeed = 1;
  private length = 0;
  public bufferTimestamp = 0;
  public trackedObjects: TrackedObject[] = [];
  private currentChunk = 0;
  private totalChunks = 0;
  private animationFrame?: number;
  private lastTime = 0;
  private frame = 0;

  static get() {
    if (!this.instance) {
      this.instance = new Simulation();
    }
    return this.instance;
  }

  public changeDataset(dataset: DatasetType) {
    this.dataset = dataset;
    this.loadDataset();
    this.reset();
  }

  private reset() {
    this.currentTimestamp = 0;
    this.frame = 0;
  }

  private loadDataset() {
    this.loadDatasetInfo();
    this.loadChunk(0);
    setInterval(() => {
      this.ensureBufferIsHealthy();
    }, 5000);
  }

  private async loadChunk(number: number) {
    try {
      const response = await fetch(
        '/api/data?dataset=' + this.dataset + '&chunk=' + number
      );
      const data: ApiResponse = await response.json();
      this.data = this.data.concat(
        data.data.map((d) => ({ ...d, consumed: false }))
      );
      this.bufferTimestamp = data.data[data.data.length - 1].timestamp;
      this.emit('chunkLoaded');
    } catch (e) {
      console.error('Loading error', e);
      this.emit('loadingError');
    }
  }

  togglePlaying() {
    this.playing = !this.playing;
    this.emit('playingChanged', this.playing);
    if (this.playing) {
      this.play();
    } else {
      if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    }
  }

  changePlaybackSpeed(speed: number) {
    this.playbackSpeed = speed;
    this.emit('playbackSpeedChanged', this.playbackSpeed);
  }

  private async loadDatasetInfo() {
    try {
      const response = await fetch('/api/info?dataset=' + this.dataset);
      const data: { length: number; totalChunks: number } =
        await response.json();
      this.length = data.length;
      this.totalChunks = data.totalChunks;
      this.emit('lengthChanged', data.length);
    } catch (e) {
      console.error('Loading error', e);
      this.emit('loadingError');
    }
  }

  private ensureBufferIsHealthy() {
    const bufferLength = this.data.filter((d) => d.consumed).length;
    if (bufferLength < 1000 && this.currentChunk < this.totalChunks) {
      this.currentChunk++;
      this.loadChunk(this.currentChunk);
    }
  }

  private play() {
    this.animationFrame = requestAnimationFrame(this.step);
  }

  private step = (time: number) => {
    this.animationFrame = requestAnimationFrame(this.step);
    const dt = time - this.lastTime;
    this.frame++;
    this.emit('step', dt);
    this.lastTime = time;
    this.currentTimestamp += dt * this.playbackSpeed;
    this.trackedObjects = [new TrackedObject()];
  };
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

  const requestRef = React.useRef<number>();
  const previousTimeRef = React.useRef<number>(0);
  const frame = React.useRef<number>(0);

  function simulate(time: number) {
    frame.current++;
    requestRef.current = requestAnimationFrame(simulate);
    const dt = time - previousTimeRef.current;
    previousTimeRef.current = time;
    if (frame.current % ((4 - playbackSpeed) * 10) === 0) {
      //step(dt, time);
    }
  }

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
