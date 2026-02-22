import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import RepeatIcon from '@mui/icons-material/Repeat';
import GridViewIcon from '@mui/icons-material/GridView';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import HistoryIcon from '@mui/icons-material/History';
import { Link } from '@tanstack/react-router';

const navList = [
  { label: 'Dashboard', icon: <GridViewIcon />, route: '/' },
  { label: 'Ordens', icon: <RepeatIcon />, route: '/orders' },
  { label: 'Portfólio', icon: <DonutSmallIcon />, route: '/portfolio' },
  { label: 'Histórico', icon: <HistoryIcon />, route: '/history' },
];

export const NavItems = () => {
  const {
    palette: {
      primary,
      common: { white },
    },
  } = useTheme();

  return (
    <Box display={'flex'} flexDirection={'column'} gap="6px" width="100%">
      {navList.map((item) => (
        <Button
          fullWidth
          key={item.label}
          component={Link}
          to={item.route}
          variant="text"
          size="large"
          startIcon={item.icon}
          activeProps={{
            style: {
              backgroundColor: primary.dark,
            },
          }}
          sx={{
            paddingX: '16px',
            justifyContent: 'flex-start',
            color: white,
            '&:hover': {
              backgroundColor: primary.dark,
            },
          }}
        >
          <Typography
            variant={'body1'}
            textAlign={'start'}
            fontWeight={500}
            width={'100%'}
            color={white}
            textTransform={'capitalize'}
          >
            {item.label}
          </Typography>
        </Button>
      ))}
    </Box>
  );
};
