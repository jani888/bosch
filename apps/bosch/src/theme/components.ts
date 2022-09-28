import { alpha, ThemeOptions } from '@mui/material';
import { colours, drawerWidth } from './variables';

export const components: ThemeOptions = {
  components: {
    MuiDrawer: {
      styleOverrides: {
        root: {
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap' as const,
          boxSizing: 'border-box' as const,
        },
        paper: {
          width: drawerWidth,
          boxSizing: 'border-box' as const,
          backgroundColor: colours.primary.dark,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: 0,
          height: 0,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: '8px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-input': {
            padding: '16px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          textTransform: 'capitalize',
          borderRadius: '24px',
          lineHeight: 1.5,
          '&.MuiButton-containedPrimary': {
            '&.Mui-disabled': {
              backgroundColor: alpha(colours.background.default, 0.9),
              color: alpha(colours.primary.dark, 0.5),
            },
          },
        },
        sizeLarge: {
          fontSize: 15,
          letterSpacing: '0.46px',
        },
        sizeMedium: {
          fontSize: 14,
          letterSpacing: '0.4px',
        },
        sizeSmall: {
          fontSize: 13,
          letterSpacing: '0.4px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: '16px',
        },
      },
    },
  },
};
