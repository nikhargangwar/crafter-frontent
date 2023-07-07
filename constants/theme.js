import { createTheme } from '@mui/material';
// import shadows from '@mui/material/styles/shadows';

export const MODE = {
  dark: 'dark',
  light: 'light',
};

export const DARK_THEME = createTheme({
  typography: {
    fontFamily: [
      'Montserrat', 
      'Poppins',
      '"Bebas Neue"',
      'sans-serif'
    ].join(','),
  },
  palette: {
    mode: MODE.dark,
    primary: {
      main: '#18CCCC',
      boxBorder:'#fff'
    },
    background: {
      default: '#211E1E',
      secondary: '#454242',
      textBox: '#8C8B8B'
    }
  },
  // shadows: [...shadows,'1.95px 1.95px 2.6px rgba(255, 255, 255, 1)']
});

export const LIGHT_THEME = createTheme({
  typography: {
    fontFamily: [
      'Montserrat', 
      'Poppins',
      '"Bebas Neue"',
      'sans-serif'
    ].join(','),
  },
  palette: {
    mode: MODE.light,
    primary: {
      main: '#18CCCC',
      boxBorder:'#000'
    },
    background: {
      default: '#ECECEC',
      secondary: '#454242',
      textBox: '#8C8B8B'
    },
  },
  // shadows: [...shadows,'1.95px 1.95px 2.6px rgba(0, 0, 0, 0.35)']
});
