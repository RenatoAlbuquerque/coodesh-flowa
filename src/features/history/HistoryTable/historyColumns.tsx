import { Avatar, Box, Stack, Typography } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import type { EventType } from '../../../@types/api';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

export const historyColumns: GridColDef[] = [
  {
    field: 'timestamp',
    headerName: 'Data/Hora',
    flex: 0.7,
    minWidth: 110,
    sortable: true,
    renderCell: (params) => (
      <Box display={'flex'} flexDirection={'column'} gap="2px">
        <Typography fontWeight={400} variant="body1" color="text.primary">
          {dayjs(params.value).format('DD/MM/YYYY')}
        </Typography>
        <Typography fontWeight={400} variant="body2" color="text.disabled">
          {dayjs(params.value).format('HH:mm:ss')}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'orderId',
    headerName: 'Ordem',
    sortable: true,
    flex: 0.6,
    minWidth: 90,
    renderCell: (params) => (
      <Typography variant="body2" fontWeight={600} color="text.disabled">
        #{params.value}
      </Typography>
    ),
  },
  {
    field: 'instrument',
    headerName: 'Instrumento',
    flex: 0.7,
    minWidth: 80,
    sortable: true,
    renderCell: (params) => (
      <Typography variant="body2" fontWeight={700} color="text.primary">
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'eventType',
    headerName: 'Evento',
    flex: 1.2,
    minWidth: 140,
    sortable: true,
    renderCell: (params) => {
      const colors: Record<
        EventType,
        { bg: string; text: string; border: string }
      > = {
        'Ordem Criada': { bg: '#F7FAFC', text: '#0F172A', border: '#E2E8F0' },
        'Execução Parcial': {
          bg: '#F59E0B',
          text: '#0F172A',
          border: '#FFEDD5',
        },
        'Execução Total': { bg: '#16A34A', text: '#fff', border: '#DCFCE7' },
        Cancelamento: { bg: '#F1F5F9', text: '#94A3B8', border: '#E2E8F0' },
      };
      const status = params.value as EventType;
      const style = colors[status] || colors['Ordem Criada'];
      return (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            border: `1px solid ${style.border}`,
            borderRadius: '20px',
            backgroundColor: style.bg,
            height: '26px',
            py: '4px',
            px: '10px',
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: style.text,
            }}
          />
          <Typography
            variant="body2"
            fontWeight={500}
            color={style.text}
            lineHeight={'0.875rem'}
          >
            {params.value}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: 'details',
    headerName: 'Detalhes',
    flex: 1.4,
    minWidth: 150,
    sortable: true,
    renderCell: (params) => (
      <Box display={'flex'} flexDirection={'column'} gap="2px">
        <Typography fontWeight={400} variant="body1" color="text.primary">
          {params.value}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'origin',
    headerName: 'Origem',
    flex: 1,
    minWidth: 150,
    sortable: true,
    renderCell: (params) => (
      <Box display={'flex'} gap="8px" alignItems={'center'}>
        {params.value.includes('Sistema') ? (
          <SmartToyOutlinedIcon htmlColor="#C7CFDA" />
        ) : (
          <Avatar sx={{ width: 20, height: 20, fontSize: '10px' }}>RA</Avatar>
        )}
        <Typography
          lineHeight={'0.75rem'}
          fontWeight={400}
          variant="body2"
          color={
            params.value.includes('Sistema') ? 'text.disabled' : 'text.primary'
          }
        >
          {params.value}
        </Typography>
      </Box>
    ),
  },
];
