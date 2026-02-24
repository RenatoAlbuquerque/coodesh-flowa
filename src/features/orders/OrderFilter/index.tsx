import { useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  Button,
  InputAdornment,
  Stack,
  Grid,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { SIDE_OPTIONS, STATUS_OPTIONS } from '../../../api/options';
import { Route } from '../../../routes/orders';
import { getUniqueValues } from '../../../utils/filterAttributes';
import { DatePickerComponent } from '../../../components/atoms/Datepicker';
import { orderFilterSchema, type OrderFilterData } from './helperOrderFilter';
import { useOrderFilters } from '../../../store/useOrderFilters';
import { AutocompleteAvailableTickets } from '../../../components/atoms/Autocomplete/AutocompleteAvailableTickets';
import type { AvailableAsset } from '../../../@types/api';

const AUTOCOMPLETE_PAPER_STYLE = {
  sx: {
    marginTop: '8px',
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    '& .MuiAutocomplete-option': { padding: '12px' },
  },
};

export const OrderFilter = () => {
  const {
    palette: { text, primary },
  } = useTheme();

  const orders = Route.useLoaderData();

  const setFilters = useOrderFilters((state) => state.setFilters);
  const resetStore = useOrderFilters((state) => state.resetFilters);
  const currentFilters = useOrderFilters((state) => state.filters);

  const instrumentOptions = useMemo(
    () => getUniqueValues(orders?.assets as AvailableAsset[], 'symbol'),
    [orders?.assets],
  );

  const isStoreEmpty = useMemo(
    () =>
      Object.values(currentFilters).every(
        (v) => v === '' || v === null || v === undefined,
      ),
    [currentFilters],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<OrderFilterData>({
    resolver: zodResolver(orderFilterSchema),
    defaultValues: currentFilters,
  });

  const onFilter = useCallback(
    async (data: OrderFilterData) => {
      setFilters(data);
    },
    [setFilters],
  );

  const handleClear = useCallback(async () => {
    const filtersAtMoment = useOrderFilters.getState().filters;
    const hasActiveFilters = Object.values(filtersAtMoment).some(
      (value) => value !== '' && value !== null && value !== undefined,
    );

    reset();

    if (hasActiveFilters) {
      resetStore();
    }
  }, [reset, resetStore]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onFilter)}
      display="flex"
      alignItems="flex-end"
      justifyContent="space-between"
      bgcolor="common.white"
      p="24px"
      border="1px solid #00000016"
      width="100%"
      borderRadius="8px"
      gap="16px"
    >
      <Grid
        container
        justifyContent={'space-between'}
        width={'100%'}
        alignItems={'end'}
        spacing={{ xs: 0.5, sm: 1, lg: 2 }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 1.8 }}>
          <Typography
            color="text.disabled"
            variant="caption"
            fontWeight={600}
            pb="4px"
            display="block"
          >
            Busca por ID
          </Typography>
          <Controller
            name="orderId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="EX: ORD-123"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlinedIcon htmlColor={text.disabled} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Typography
            color="text.disabled"
            variant="caption"
            fontWeight={600}
            pb="4px"
            display="block"
          >
            Instrumento
          </Typography>
          <AutocompleteAvailableTickets
            name="instrument"
            control={control}
            options={instrumentOptions}
            placeholder="Todos os ativos"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Typography
            color="text.disabled"
            variant="caption"
            fontWeight={600}
            pb="4px"
            display="block"
          >
            Lado
          </Typography>
          <Controller
            name="side"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={SIDE_OPTIONS}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Compra / Venda"
                  />
                )}
                slotProps={{ paper: AUTOCOMPLETE_PAPER_STYLE }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 1.5 }}>
          <Typography
            color="text.disabled"
            variant="caption"
            fontWeight={600}
            pb="4px"
            display="block"
          >
            Status
          </Typography>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={STATUS_OPTIONS}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField {...params} size="small" placeholder="Todos" />
                )}
                slotProps={{ paper: AUTOCOMPLETE_PAPER_STYLE }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Typography
            color="text.disabled"
            variant="caption"
            fontWeight={600}
            pb="4px"
            display="block"
          >
            Data
          </Typography>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePickerComponent
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.7 }}>
          <Stack direction="row" spacing={2} width={'100%'}>
            <Button
              variant="contained"
              size="large"
              onClick={handleClear}
              disabled={isStoreEmpty && !isDirty}
              sx={{
                boxShadow: 'none',
                bgcolor: text.disabled,
                height: '40px',
                '&:hover': { bgcolor: '#64748b' },
              }}
              fullWidth
            >
              <Typography
                variant="body1"
                color="white"
                textTransform="capitalize"
                fontWeight={500}
              >
                Limpar
              </Typography>
            </Button>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting || !isDirty}
              fullWidth
              sx={{
                boxShadow: 'none',
                bgcolor: primary.dark,
                height: '40px',
                '&:hover': { bgcolor: primary.main },
              }}
            >
              <Typography
                variant="body1"
                color="white"
                textTransform="capitalize"
                fontWeight={500}
              >
                Filtrar
              </Typography>
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
