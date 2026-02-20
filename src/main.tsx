import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './styles/theme.ts';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource-variable/inter/index.css';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
