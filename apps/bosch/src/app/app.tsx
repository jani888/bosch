import React, { useEffect, useState } from 'react';
import { Message } from '@bosch/api-interfaces';
import {
  Button,
  Container,
  createTheme,
  CssBaseline,
  TextField,
  ThemeProvider,
} from '@mui/material';
import { mainTheme } from '../theme/mainTheme';

export const App = () => {
  const [m, setMessage] = useState<Message>({ message: '' });

  useEffect(() => {
    fetch('/api')
      .then((r) => r.json())
      .then(setMessage);
  }, []);

  return (
    <ThemeProvider theme={createTheme(mainTheme)}>
      <CssBaseline />
      <Container>
        <TextField value={m.message} />
        <Button>Teszt</Button>
      </Container>
    </ThemeProvider>
  );
};

export default App;
