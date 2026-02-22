import { useState } from 'react';
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { toast } from 'react-toastify';
import type { Order } from '../../../../@types/api';
import { useOrderStore } from '../../../../store/useOrderStore';
import { formatCurrency } from '../../../../utils/formatNumber';

export const TableOrderModal = ({ order }: { order: Order }) => {
  const [openCancel, setOpenCancel] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const cancelOrder = useOrderStore((state) => state.cancelOrder);

  const handleConfirmCancel = async () => {
    setIsPending(true);

    const cancelAction = (async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await cancelOrder(order);
    })();

    toast.promise(cancelAction, {
      pending: 'Solicitando cancelamento...',
      success: `Ordem #${order.id} cancelada com sucesso! 🗑️`,
      error: 'Erro ao cancelar ordem. Tente novamente. 🤯',
    });

    try {
      await cancelAction;
      setOpenCancel(false);
    } catch (error) {
      console.error('Erro no cancelamento:', error);
    } finally {
      setIsPending(false);
    }
  };

  const isCancelable = order.status === 'Aberta' || order.status === 'Parcial';

  return (
    <Stack
      direction="row"
      spacing={0.5}
      justifyContent="flex-end"
      alignItems="center"
    >
      <Tooltip title="Ver Detalhes">
        <IconButton
          size="small"
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip
        title={isCancelable ? 'Cancelar Ordem' : 'Ordem não cancelável'}
        onClick={(e) => e.stopPropagation()}
      >
        <span>
          {' '}
          <IconButton
            disabled={!isCancelable}
            size="small"
            onClick={() => setOpenCancel(true)}
            sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
          >
            <CancelOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Dialog
        open={openCancel}
        onClose={isPending ? undefined : () => setOpenCancel(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            width: '100%',
            maxWidth: 400,
            backgroundColor: '#fff',
          },
        }}
      >
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}
        >
          <WarningAmberRoundedIcon color="error" />
          <Typography variant="h2" fontWeight={700}>
            Cancelar Ordem
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Você está prestes a cancelar a ordem <strong>#{order.id}</strong>.
            Confira os detalhes da operação que será interrompida:
          </Typography>

          <Box
            sx={{
              bgcolor: 'rgba(241, 245, 249, 0.5)',
              borderRadius: 2,
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack spacing={1.5}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Ativo:
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {order.instrument} - {order.category}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Lado:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{
                    color:
                      order.side === 'COMPRA' ? 'success.main' : 'error.main',
                  }}
                >
                  {order.side}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Quantidade Restante:
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {order.remainingQuantity} de {order.quantity}
                </Typography>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                sx={{
                  pt: 1,
                  borderTop: '1px dashed',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Volume a Cancelar:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={800}
                  color="primary.main"
                >
                  {formatCurrency(order.price * order.remainingQuantity)}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Typography
            variant="caption"
            color="error"
            sx={{
              mt: 2,
              display: 'block',
              fontWeight: 500,
            }}
          >
            * Esta ação removerá imediatamente a oferta do livro de negociações.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenCancel(false)}
            color="inherit"
            disabled={isPending}
            sx={{ fontWeight: 600, textTransform: 'none' }}
          >
            Voltar
          </Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            color="error"
            disabled={isPending}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: 'none',
              minWidth: '110px',
              '&:hover': { boxShadow: 'none', bgcolor: 'error.dark' },
            }}
          >
            {isPending ? 'Cancelando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
