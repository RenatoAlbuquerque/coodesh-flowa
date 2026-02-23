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

export const NavItems = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const {
    palette: {
      primary,
      common: { white },
    },
  } = useTheme();

  return (
    <Box display="flex" flexDirection="column" gap="6px" width="100%">
      {navList.map((item) => (
        <Button
          key={item.label}
          component={Link}
          to={item.route}
          fullWidth
          variant="text"
          size="large"
          startIcon={!isCollapsed ? item.icon : null}
          activeProps={{
            style: {
              backgroundColor: primary.dark,
            },
          }}
          sx={{
            paddingX: isCollapsed ? '0px' : '16px',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            minWidth: 0,
            color: white,
            '&:hover': { backgroundColor: primary.dark },
          }}
        >
          {isCollapsed ? (
            item.icon
          ) : (
            <Typography
              variant="body1"
              fontWeight={500}
              textTransform="capitalize"
              color={white}
            >
              {item.label}
            </Typography>
          )}
        </Button>
      ))}
    </Box>
  );
};
