import { Box, Chip, Stack, Typography } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { formatCurrency, formatNumber } from '../../../utils/formatNumber';
import type { Order, OrderStatus } from '../../../@types/api';
import { TableOrderModal } from '../../../components/molecules/Modals/TableOrderModal';

export const orderColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    sortable: true,
    flex: 0.6,
    minWidth: 90,
    renderCell: (params) => (
      <Typography variant="body2" fontWeight={600} color="text.primary">
        #{params.value}
      </Typography>
    ),
  },
  {
    field: 'instrument',
    headerName: 'Instrumento',
    flex: 1,
    minWidth: 120,
    sortable: true,
    renderCell: (params) => (
      <Typography variant="body2" fontWeight={700}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'side',
    headerName: 'Lado',
    flex: 0.8,
    minWidth: 100,
    sortable: false,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        sx={{
          borderRadius: '4px',
          fontWeight: 700,
          backgroundColor: params.value === 'COMPRA' ? '#16A34A' : '#E02424',
          color: '#fff',
          height: '22px',
          fontSize: '10px',
        }}
      />
    ),
  },
  {
    field: 'price',
    headerName: 'Preço',
    sortable: true,
    flex: 1,
    minWidth: 110,
    valueFormatter: (value) => `${formatCurrency(value)}`,
  },
  {
    field: 'quantity',
    sortable: true,
    headerName: 'Quantidade',
    flex: 1,
    minWidth: 110,
    valueFormatter: (value) => `${formatNumber(value)}`,
  },
  {
    field: 'remainingQuantity',
    sortable: true,
    headerName: 'Qtd. Restante',
    flex: 1,
    minWidth: 120,
    valueFormatter: (value) => `${formatNumber(value)}`,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1.2,
    minWidth: 140,
    sortable: false,
    renderCell: (params) => {
      const colors: Record<
        OrderStatus,
        { bg: string; text: string; border: string }
      > = {
        Aberta: { bg: '#F7FAFC', text: '#0F172A', border: '#E2E8F0' },
        Parcial: { bg: '#F59E0B', text: '#0F172A', border: '#FFEDD5' },
        Executada: { bg: '#16A34A', text: '#fff', border: '#DCFCE7' },
        Cancelada: { bg: '#F1F5F9', text: '#94A3B8', border: '#E2E8F0' },
      };
      const status = params.value as OrderStatus;
      const style = colors[status] || colors['Aberta'];
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
    field: 'createdAt',
    headerName: 'Data/Hora',
    flex: 1,
    minWidth: 110,
    sortable: true,
    renderCell: (params) => (
      <Box display={'flex'} flexDirection={'column'} gap="2px">
        <Typography fontWeight={400} variant="body1">
          {dayjs(params.value).format('DD/MM/YYYY')}
        </Typography>
        <Typography fontWeight={400} variant="body2" color="text.disabled">
          {dayjs(params.value).format('HH:mm:ss')}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'actions',
    headerName: 'Ações',
    sortable: false,
    width: 110,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => <TableOrderModal order={params.row as Order} />,
  },
];
