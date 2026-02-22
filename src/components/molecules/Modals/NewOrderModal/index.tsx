import {
  useForm,
  Controller,
  useWatch,
  type SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Grid,
  useTheme,
} from '@mui/material';
import { useOrderStore } from '../../../../store/useOrderStore';
import { orderSchema } from './newOrderScheme';
import type { OrderFormData, OrderFormInput } from './newOrderScheme';
import LogoFlowaStock from '../../../../assets/flowastock-logo.png';
import { formatCurrency } from '../../../../utils/formatNumber';
import { AutocompleteAvailableTickets } from '../../../atoms/Autocomplete/AutocompleteAvailableTickets';
import { getUniqueValues } from '../../../../utils/filterAttributes';
import { toast } from 'react-toastify';

interface NewOrderModalProps {
  open: boolean;
  onClose: () => void;
}

export const NewOrderModal = ({ open, onClose }: NewOrderModalProps) => {
  const { createOrder, availableAssets } = useOrderStore();
  const INSTRUMENT_OPTIONS = getUniqueValues(availableAssets, 'symbol');
  const {
    palette: { common },
  } = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormInput>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      instrument: '',
      side: 'COMPRA',
      price: 1,
      quantity: 1,
    },
  });

  const watchedPrice = useWatch({ control, name: 'price' }) || 0;
  const watchedQuantity = useWatch({ control, name: 'quantity' }) || 0;
  const totalEstimated =
    (Number(watchedPrice) || 0) * (Number(watchedQuantity) || 0);

  const onSubmit: SubmitHandler<OrderFormInput> = async (data) => {
    await toast.promise(
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return createOrder(data as OrderFormData);
      })(),
      {
        pending: 'Enviando ordem para a bolsa...',
        success: '🚀 Ordem enviada para o mercado!',
        error: 'Falha na comunicação 🤯',
      },
    );
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: common.white,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${LogoFlowaStock})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            opacity: 0.2,
            pointerEvents: 'none',
          },
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{ px: 4, pt: 4, pb: 1, position: 'relative' }}
      >
        <Typography variant="h1" fontWeight={700}>
          Nova Ordem
        </Typography>
        <Typography variant="body1" color="text.disabled">
          Configure sua operação financeira.
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ px: 4, py: 2, position: 'relative' }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" fontWeight={600} mb={1}>
                Ativo Disponível
              </Typography>
              <AutocompleteAvailableTickets
                name="instrument"
                control={control}
                options={INSTRUMENT_OPTIONS}
                placeholder="Todos os ativos"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" fontWeight={600} mb={1}>
                Lado da Operação
              </Typography>
              <Controller
                name="side"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    {...field}
                    exclusive
                    fullWidth
                    onChange={(_, value) => value && field.onChange(value)}
                    sx={{ height: 48, bgcolor: 'rgba(255,255,255,0.7)' }}
                  >
                    <ToggleButton
                      value="COMPRA"
                      sx={{
                        fontWeight: 700,
                        borderWidth: 2,
                        '&.Mui-selected': {
                          borderColor: 'success.main',
                          color: 'success.main',
                          backgroundColor: 'rgba(22, 163, 74, 0.08)',
                          '&:hover': {
                            backgroundColor: 'rgba(22, 163, 74, 0.12)',
                          },
                        },
                      }}
                    >
                      COMPRA
                    </ToggleButton>
                    <ToggleButton
                      value="VENDA"
                      sx={{
                        fontWeight: 700,
                        borderWidth: 2,
                        '&.Mui-selected': {
                          borderColor: 'error.main',
                          color: 'error.main',
                          backgroundColor: 'rgba(224, 36, 36, 0.08)',
                          '&:hover': {
                            backgroundColor: 'rgba(224, 36, 36, 0.12)',
                          },
                        },
                      }}
                    >
                      VENDA
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Quantidade"
                    type="number"
                    fullWidth
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                    slotProps={{
                      htmlInput: {
                        min: 1,
                        step: 1,
                        onKeyPress: (
                          e: React.KeyboardEvent<HTMLDivElement>,
                        ) => {
                          if (['.', ',', '-', 'e'].includes(e.key))
                            e.preventDefault();
                        },
                      },
                    }}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      field.onChange(val <= 0 ? '' : val);
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Preço Unitário (R$)"
                    type="number"
                    fullWidth
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    slotProps={{
                      htmlInput: {
                        min: 0.01,
                        step: 0.01,
                        onKeyPress: (
                          e: React.KeyboardEvent<HTMLDivElement>,
                        ) => {
                          if (['-', 'e', '+'].includes(e.key))
                            e.preventDefault();
                        },
                      },
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        field.onChange('');
                        return;
                      }
                      if (value.includes('.') && value.split('.')[1].length > 2)
                        return;
                      const valNum = Number(value);
                      field.onChange(valNum <= 0 ? '' : valNum);
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box
                bgcolor="secondary.main"
                p={2.5}
                borderRadius={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                border="1px solid"
                borderColor="divider"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    TOTAL ESTIMADO
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Taxas da Flowa Stock não inclusas
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={800} color="primary.main">
                  {formatCurrency(totalEstimated)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{ px: 4, pb: 4, pt: 1, gap: 1, position: 'relative' }}
        >
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            size="large"
            sx={{
              px: 6,
              py: 1.2,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            {isSubmitting ? 'Processando...' : 'Confirmar Ordem'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
