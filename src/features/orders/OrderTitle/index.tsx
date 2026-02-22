import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useState } from 'react';
import { NewOrderModal } from '../../../components/molecules/Modals/NewOrderModal';

export const OrderTitle = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Box
        display={'flex'}
        py="32px"
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box>
          <Typography variant="h1" fontWeight={700} pb="6px">
            Gerenciamento de Ordens
          </Typography>
          <Typography variant="h2" fontWeight={400} color="text.disabled">
            Visualize e gerencie ordens de compra e venda na plataforma BASE
            Exchange.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddOutlinedIcon />}
          size="large"
          onClick={() => setIsModalOpen(true)}
        >
          <Typography textTransform={'capitalize'} variant="body1">
            Nova Ordem
          </Typography>
        </Button>
      </Box>
      <NewOrderModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
