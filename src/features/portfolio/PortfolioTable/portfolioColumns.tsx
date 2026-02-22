import { Typography } from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import { formatCurrency, formatNumber } from '../../../utils/formatNumber';

export const portfolioColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Ativo',
    sortable: true,
    flex: 0.6,
    minWidth: 120,
    renderCell: (params) => (
      <Typography variant="body2" fontWeight={600} color="text.primary">
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'type',
    headerName: 'Tipo',
    sortable: true,
    flex: 0.6,
    minWidth: 120,
    renderCell: (params) => (
      <Typography
        textTransform={'uppercase'}
        variant="body2"
        sx={{ px: '8px', py: '4px', borderRadius: '4px', bgcolor: '#0b3eb528' }}
        fontWeight={600}
        color="text.primary"
      >
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'quantity',
    headerName: 'Quantidade',
    sortable: true,
    flex: 1,
    minWidth: 110,
    valueFormatter: (value) => `${formatNumber(value)}`,
  },
  {
    field: 'avgPrice',
    headerName: 'Preço Médio',
    sortable: true,
    flex: 1,
    minWidth: 110,
    valueFormatter: (value) => `${formatCurrency(value)}`,
  },
  {
    field: 'currentPrice',
    headerName: 'Preço Atual',
    sortable: true,
    flex: 1,
    minWidth: 110,
    valueFormatter: (value) => `${formatCurrency(value)}`,
  },
  {
    field: 'totalValue',
    headerName: 'Valor Total',
    sortable: true,
    flex: 1,
    minWidth: 110,
    valueFormatter: (value) => `${formatCurrency(value)}`,
  },
  {
    field: 'profitPercent',
    headerName: 'Rentabilidade',
    sortable: true,
    flex: 1,
    minWidth: 110,
    renderCell: (params) => {
      const value = params.value as number;
      const isPositive = value > 0;
      const isNegative = value < 0;

      const color = isPositive ? '#2e7d32' : isNegative ? '#d32f2f' : 'inherit';

      return (
        <span
          style={{
            color: color,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isPositive ? '▲ ' : isNegative ? '▼ ' : ''}
          {value.toFixed(2)}%
        </span>
      );
    },
  },
];
