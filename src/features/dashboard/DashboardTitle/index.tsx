import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { NewOrderModal } from '../../../components/molecules/Modals/NewOrderModal';
import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Route } from '../../../routes';

export const DashboardTitle = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const useRouterHook = useRouter();
  const {
    palette: { common },
  } = useTheme();
  const { assets } = Route.useLoaderData();

  const handleOrderSuccess = () => {
    useRouterHook.invalidate();
  };

  return (
    <Box
      display={'flex'}
      flexDirection={{ xs: 'column', sm: 'row' }}
      py="32px"
      alignItems={'center'}
      justifyContent={'space-between'}
      gap={{ xs: '20px', sm: '10px' }}
    >
      <Box>
        <Typography
          textAlign={{ xs: 'center', sm: 'start' }}
          variant="h1"
          fontWeight={700}
          pb="6px"
        >
          Dashboard
        </Typography>
        <Typography
          textAlign={{ xs: 'center', sm: 'start' }}
          variant="h2"
          fontWeight={400}
          color="text.disabled"
        >
          Visao geral do seu portfolio e mercado na Flowa Stock.
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<AddOutlinedIcon htmlColor={common.white} />}
        size="large"
        color="primary"
        onClick={() => setIsModalOpen(true)}
      >
        <Typography
          textTransform={'capitalize'}
          variant="body1"
          color="common.white"
        >
          Nova Ordem
        </Typography>
      </Button>

      <NewOrderModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleOrderSuccess}
        availableAssets={assets}
      />
    </Box>
  );
};
