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
  Grid,
  Stack,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { EVENT_OPTIONS } from '../../../api/options';
import { getUniqueValues } from '../../../utils/filterAttributes';
import { DatePickerComponent } from '../../../components/atoms/Datepicker';
import { AutocompleteAvailableTickets } from '../../../components/atoms/Autocomplete/AutocompleteAvailableTickets';
import {
  historyFilterSchema,
  type HistoryFilterData,
} from './helperHistoryFilter';
import { useHistoryFilters } from '../../../store/useHistoryFilter';
import { Route } from '../../../routes/history';
import { useCallback } from 'react';
import type { AvailableAsset } from '../../../@types/api';

export const HistoryFilter = () => {
  const {
    palette: { text, primary },
  } = useTheme();
  const { assets }: { assets: AvailableAsset[] } = Route.useLoaderData();
  const INSTRUMENT_OPTIONS = getUniqueValues(assets, 'symbol');
  const currentFilters = useHistoryFilters((state) => state.filters);

  const setFilters = useHistoryFilters((state) => state.setFilters);
  const resetStore = useHistoryFilters((state) => state.resetFilters);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<HistoryFilterData>({
    resolver: zodResolver(historyFilterSchema),
    defaultValues: currentFilters,
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
            options={INSTRUMENT_OPTIONS}
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 1.5 }}>
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
              <DatePickerComponent
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
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
            Data Fim
          </Typography>
          <Controller
            name="endDate"
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
              fullWidth
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
              fullWidth
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
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
