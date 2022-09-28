import { ThemeOptions } from '@mui/material/styles/createTheme';

import { components } from './components';
import { colours, fonts } from './variables';

const mainTheme: ThemeOptions = {
  palette: {
    divider: 'rgba(0, 0, 0, 0.12)',
    text: {
      primary: '#1F1F1F',
      secondary: '#737373',
      disabled: '#B3B3B3',
    },
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'linear-gradient(0deg, #E4E4E4, #E4E4E4)',
      focus: 'rgba(0, 0, 0, 0.12)',
    },
    ...colours,
  },
  typography: {
    fontFamily: [fonts.default, 'Roboto', 'sans-serif'].join(','),
    h1: {
      fontStyle: 'normal',
      fontWeight: 300,
      fontSize: '96px',
      letterSpacing: '-1.5px',
    },
    h2: {
      fontStyle: 'normal',
      fontWeight: 300,
      fontSize: '60px',
      letterSpacing: '-0.5px',
    },
    h3: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '48px',
      letterSpacing: '0px',
    },
    h4: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '34px',
      letterSpacing: '0.25px',
    },
    h5: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '24px',
      letterSpacing: '0px',
    },
    h6: {
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: '20px',
      letterSpacing: '0.15px',
    },
    subtitle1: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '16px',
      letterSpacing: '0.15px',
    },
    subtitle2: {
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: '14px',
      letterSpacing: '0.1px',
    },
    body1: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '16px',
      letterSpacing: '0.15px',
    },
    body2: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      letterSpacing: '0.15px',
    },
    caption: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      letterSpacing: '0.4px',
    },
    overline: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '12px',
      letterSpacing: '1px',
      textTransform: 'uppercase' as const,
    },
  },
  ...components,
};

export { mainTheme };
