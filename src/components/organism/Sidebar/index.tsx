import { useState } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Logo } from '../../atoms/Logo';
import { NavItems } from '../../molecules/NavItems';

export const Sidebar = () => {
  const {
    shadows,
    transitions,
    palette: { common },
  } = useTheme();

  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const CLOSED_WIDTH = '60px';
  const OPEN_WIDTH = '230px';

  return (
    <>
      <Box
        component="aside"
        sx={{
          width: isCollapsed ? CLOSED_WIDTH : OPEN_WIDTH,
          bgcolor: 'background.paper',
          px: isCollapsed ? '8px' : '24px',
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
          boxShadow: isCollapsed ? 'none' : shadows[8],
          transition: transitions.create(['width', 'padding'], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.shorter,
          }),
          overflowX: 'hidden',
        }}
      >
        <Box
          display="flex"
          justifyContent={isCollapsed ? 'center' : 'flex-end'}
          mb="20px"
          width="100%"
        >
          <IconButton
            onClick={toggleSidebar}
            size="small"
            sx={{ color: 'secondary' }}
          >
            {isCollapsed ? (
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
          alignItems={'center'}
        >
          <Logo isCollapsed={isCollapsed} />
          <NavItems isCollapsed={isCollapsed} />
        </Box>
      </Box>

      <Box
        sx={{
          width: CLOSED_WIDTH,
          minWidth: CLOSED_WIDTH,
          height: '100dvh',
          flexShrink: 0,
        }}
      />
    </>
  );
};
