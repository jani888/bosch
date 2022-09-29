import React from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { mainTheme } from '../theme/mainTheme';
import { View3D } from './components/View3D';

export const App = () => {
  return (
    <ThemeProvider theme={createTheme(mainTheme)}>
      <CssBaseline />
      <div
        style={{
          height: '100vh',
        }}
      >
        <View3D />
      </div>
    </ThemeProvider>
  );
};

export default App;
