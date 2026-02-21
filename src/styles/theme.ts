import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    h1: { fontSize: '1.75rem' },
    h2: { fontSize: '1rem' },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.75rem' },
    subtitle1: { fontSize: '0.625rem' },
  },
  palette: {
    primary: {
      main: '#0b66ff',
      dark: '#092D66',
    },
    secondary: {
      main: '#e6f0ff',
    },
    text: {
      primary: '#0F172A',
      disabled: '#94A3B8',
    },
    warning: { main: '#F59E0B' },
    success: { main: '#16A34A' },
    error: { main: '#E02424' },
    background: {
      default: '#f7fafc',
      paper: '#0B1220',
    },
    common: {
      black: '#000',
      white: '#fff',
    },
  },
});
