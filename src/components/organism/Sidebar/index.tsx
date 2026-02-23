import { useState, useEffect } from 'react';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Logo } from '../../atoms/Logo';
import { NavItems } from '../../molecules/NavItems';

export const Sidebar = () => {
  const { shadows, transitions, palette: { common }, breakpoints } = useTheme();
  const isLargeScreen = useMediaQuery(breakpoints.up('lg'));

  const [isCollapsed, setIsCollapsed] = useState(true);

  const activeCollapsed = isLargeScreen ? false : isCollapsed;

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const CLOSED_WIDTH = '60px';
  const OPEN_WIDTH = '230px';
  const currentWidth = activeCollapsed ? CLOSED_WIDTH : OPEN_WIDTH;

  return (
    <>
      <Box
        component="aside"
        sx={{
          width: currentWidth,
          minWidth: currentWidth,
          bgcolor: 'background.paper',
          px: activeCollapsed ? '8px' : '24px',
          py: '20px',
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1200,
          borderRight: '1px solid',
          borderColor: 'divider',
          boxShadow: !activeCollapsed && !isLargeScreen ? shadows[8] : 'none',
          transition: transitions.create(['width', 'padding', 'background-color'], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.shorter,
          }),
          overflowX: 'hidden',
          pointerEvents: 'auto',
        }}
      >
        <Box
          display={isLargeScreen ? 'none' : 'flex'}
          justifyContent={activeCollapsed ? 'center' : 'flex-end'}
          mb="20px"
          width="100%"
        >
          <IconButton onClick={toggleSidebar} size="small">
            {activeCollapsed ? (
              <MenuIcon htmlColor={common.white} />
            ) : (
              <ChevronLeftIcon htmlColor={common.white} />
            )}
          </IconButton>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          gap="44px"
          width="100%"
          alignItems="center"
          mt={isLargeScreen ? '40px' : 0}
        >
          <Logo isCollapsed={activeCollapsed} />
          <NavItems isCollapsed={activeCollapsed} />
        </Box>
      </Box>

      <Box
        sx={{
          width: isLargeScreen ? OPEN_WIDTH : CLOSED_WIDTH,
          minWidth: isLargeScreen ? OPEN_WIDTH : CLOSED_WIDTH,
          height: '100dvh',
          flexShrink: 0,
          transition: transitions.create('width'),
        }}
      />
    </>
  );
};