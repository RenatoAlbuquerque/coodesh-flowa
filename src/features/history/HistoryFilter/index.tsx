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
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { EVENT_OPTIONS } from '../../../api/options';
import { getUniqueValues } from '../../../utils/filterAttributes';
import { DatePicker } from '../../../components/atoms/Datepicker';
import { AutocompleteAvailableTickets } from '../../../components/atoms/Autocomplete/AutocompleteAvailableTickets';
import {
  historyFilterSchema,
  type HistoryFilterData,
} from './helperHistoryFilter';
import { useHistoryFilters } from '../../../store/useHistoryFilter';
import { Route } from '../../../routes/history';
import { useCallback } from 'react';

export const HistoryFilter = () => {
  const {
    palette: { text, primary },
  } = useTheme();
  const { assets } = Route.useLoaderData();
  const INSTRUMENT_OPTIONS = getUniqueValues(assets, 'symbol');

  const setFilters = useHistoryFilters((state) => state.setFilters);
  const resetStore = useHistoryFilters((state) => state.resetFilters);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<HistoryFilterData>({
    resolver: zodResolver(historyFilterSchema),
    defaultValues: {
      orderId: '',
      instrument: null,
      eventType: null,
      startDate: null,
      endDate: null,
    },
  });

  const onFilter = useCallback(
    async (data: HistoryFilterData) => {
      setFilters(data);
    },
    [setFilters],
  );

  const handleClear = async () => {
    const filtersAtMoment = useHistoryFilters.getState().filters;
    const hasActiveFilters = Object.values(filtersAtMoment).some(
      (value) => value !== '' && value !== null && value !== undefined,
    );

    reset();

    if (hasActiveFilters) {
      resetStore();
    }
  };

  const autocompletePaperStyle = {
    sx: {
      marginTop: '8px',
      backgroundColor: '#f5f5f5',
      boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      '& .MuiAutocomplete-option': { padding: '12px' },
    },
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onFilter)}
      display={'flex'}
      alignItems={'flex-end'}
      justifyContent={'space-between'}
      bgcolor={'common.white'}
      p="24px"
      border={'1px solid #00000016'}
      width={'100%'}
      borderRadius={'8px'}
      gap="16px"
    >
      <Box flex={1} maxWidth={'200px'}>
        <Typography
          color="text.disabled"
          variant="caption"
          fontWeight={600}
          pb="4px"
          display="block"
        >
          ID da Ordem
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
          options={INSTRUMENT_OPTIONS}
          placeholder="Todos os ativos"
        />
      </Box>

      <Box flex={1} maxWidth={'160px'}>
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
          name="eventType"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={EVENT_OPTIONS}
              onChange={(_, value) => field.onChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Todos os eventos"
                />
              )}
              slotProps={{ paper: autocompletePaperStyle }}
            />
          )}
        />
      </Box>

      <Box flex={1} maxWidth={'160px'}>
        <Typography
          color="text.disabled"
          variant="caption"
          fontWeight={600}
          pb="4px"
          display="block"
        >
          Data Início
        </Typography>
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={(newValue) => field.onChange(newValue)}
            />
          )}
        />
      </Box>

      <Box flex={1} maxWidth={'160px'}>
        <Typography
          color="text.disabled"
          variant="caption"
          fontWeight={600}
          pb="4px"
          display="block"
        >
          Data Fim
        </Typography>
        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={(newValue) => field.onChange(newValue)}
            />
          )}
        />
      </Box>

      <Button
        variant="contained"
        size="large"
        onClick={handleClear}
        sx={{ boxShadow: 'none', bgcolor: text.disabled, height: '40px' }}
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
        sx={{ boxShadow: 'none', bgcolor: primary.dark, height: '40px' }}
        disabled={isSubmitting || !isDirty}
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
    </Box>
  );
};
