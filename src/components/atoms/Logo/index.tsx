import { Box } from '@mui/material';
import LogoFlowa from '../../../assets/flowastock-logo.png';

export const Logo = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <Box
      component="img"
      src={LogoFlowa}
      alt="logo flowa"
      sx={{
        height: '40px',
        width: isCollapsed ? '40px' : '90px',
        objectFit: 'contain',
        transition: 'width 0.3s ease',
      }}
    />
  );
};
