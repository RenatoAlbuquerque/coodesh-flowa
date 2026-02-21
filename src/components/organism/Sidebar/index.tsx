import Box from '@mui/material/Box';
import { Logo } from '../../atoms/Logo';
import { NavItems } from '../../molecules/NavItems';

export const Sidebar = () => {
  return (
    <Box
      width={'280px'}
      bgcolor={'background.paper'}
      px="24px"
      py="20px"
      height={'100dvh'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
    >
      <Box display={'flex'} flexDirection={'column'} gap="44px">
        <Logo />
        <NavItems />
      </Box>
    </Box>
  );
};
