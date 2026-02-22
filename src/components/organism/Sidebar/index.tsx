import Box from '@mui/material/Box';
import { Logo } from '../../atoms/Logo';
import { NavItems } from '../../molecules/NavItems';

const SIDEBAR_WIDTH = '250px';

export const Sidebar = () => {
  return (
    <>
      <Box
        component="aside"
        sx={{
          width: SIDEBAR_WIDTH,
          minWidth: SIDEBAR_WIDTH,
          bgcolor: 'background.paper',
          px: '24px',
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
        }}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          gap="44px"
          width={'100%'}
        >
          <Logo />
          <NavItems />
        </Box>
      </Box>

      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          minWidth: SIDEBAR_WIDTH,
          height: '100dvh',
          flexShrink: 0,
        }}
      />
    </>
  );
};
