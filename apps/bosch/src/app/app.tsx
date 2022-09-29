import React, { useEffect, useState } from 'react';
import { createTheme, CssBaseline, Stack, ThemeProvider } from '@mui/material';
import { mainTheme } from '../theme/mainTheme';
import { View3D } from './components/View3D';
import { step } from './simulation';
import { ObjectList } from './components/object-list/ObjectList';
import { useTrackedObjectList } from './hooks/useTrackedObjectList';
import { PlaybackControl } from './components/PlaybackControl';

export const PlaybackContext = React.createContext<{
  isPlaying: boolean;
  speed: number;
}>({
  isPlaying: false,
  speed: 1,
});

export const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const trackedObjectList = useTrackedObjectList();
  const [selectedObjectId, setSelectedObjectId] = useState('');

  const requestRef = React.useRef<number>();
  const previousTimeRef = React.useRef<number>(0);
  const frame = React.useRef<number>(0);

  function simulate(time: number) {
    frame.current++;
    requestRef.current = requestAnimationFrame(simulate);
    const dt = time - previousTimeRef.current;
    previousTimeRef.current = time;
    if (frame.current % ((4 - playbackSpeed) * 10) === 0) {
      console.log('Step', playbackSpeed);
      step(dt);
    }
  }

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(simulate);
    } else {
      cancelAnimationFrame(requestRef.current ?? 0);
    }
    return () => cancelAnimationFrame(requestRef.current ?? 0);
  }, [isPlaying, playbackSpeed]);

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
            <View3D data={trackedObjectList} selected={selectedObjectId} />
            <PlaybackControl
              speed={playbackSpeed}
              isPlaying={isPlaying}
              onTogglePlayback={() => {
                setIsPlaying((v) => !v);
              }}
              onSpeedChange={setPlaybackSpeed}
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
