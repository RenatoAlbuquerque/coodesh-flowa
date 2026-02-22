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
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { SIDE_OPTIONS, STATUS_OPTIONS } from '../../../api/options';
import { Route } from '../../../routes/orders';
import { getUniqueValues } from '../../../utils/filterAttributes';
import { DatePicker } from '../../../components/atoms/Datepicker';
import { orderFilterSchema, type OrderFilterData } from './helperOrderFilter';
import { useOrderFilters } from '../../../store/useOrderFilters';
import { AutocompleteAvailableTickets } from '../../../components/atoms/Autocomplete/AutocompleteAvailableTickets';
import { useOrderStore } from '../../../store/useOrderStore';

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
    () => getUniqueValues(orders.assets, 'symbol'),
    [orders.assets],
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
    defaultValues: {
      orderId: '',
      instrument: null,
      side: null,
      status: null,
      date: null,
    },
  });

  const onFilter = useCallback(
    async (data: OrderFilterData) => {
      setFilters(data);
      const { getOrders } = useOrderStore.getState();
      await getOrders();
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
      const { getOrders } = useOrderStore.getState();
      await getOrders();
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
      <Box flex={1} maxWidth="200px">
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
              placeholder="EX: #ORD-123"
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
      </Box>

      {/* Instrumento */}
      <Box flex={1}>
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
      </Box>

      {/* Lado */}
      <Box flex={1} maxWidth="160px">
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
      </Box>

      <Box flex={1} maxWidth="160px">
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
      </Box>

      {/* Data */}
      <Box flex={1} maxWidth="160px">
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
            <DatePicker
              value={field.value}
              onChange={(newValue) => field.onChange(newValue)}
            />
          )}
        />
      </Box>

      <Stack direction="row" spacing={2}>
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
    </Box>
  );
};
