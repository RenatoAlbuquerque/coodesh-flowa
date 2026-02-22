import { useMemo } from 'react'; // Importante para performance
import { PieChart } from '@mui/x-charts/PieChart';
import { Route } from '../../../routes';
import { formatCurrency } from '../../../utils/formatNumber';

const COLORS = ['#0A68FE', '#E1EBFD', '#75aeff'];

const CHART_SX = {
  '& .MuiPieArc-root:hover': {
    fill: '#555',
    cursor: 'pointer',
  },
};

export const ChartDonutPortfolio = () => {
  const { allocation } = Route.useLoaderData();

  const data = useMemo(
    () => [
      { label: 'Ações', value: allocation['Ações'], color: COLORS[0] },
      {
        label: 'Renda Fixa',
        value: allocation['Renda Fixa'],
        color: COLORS[1],
      },
      { label: 'Caixa', value: allocation['Caixa'], color: COLORS[2] },
    ],
    [allocation],
  );

  const slotProps = useMemo(
    () => ({
      legend: {
        direction: 'horizontal' as const,
        position: { vertical: 'bottom', horizontal: 'center' } as const,
      },
      tooltip: {
        sx: {
          '& .MuiChartsTooltip-paper': {
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            border: 'none',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
          },
          '& .MuiChartsTooltip-label': {
            color: '#FFF',
            fontWeight: 'bold',
          },
          '& .MuiChartsTooltip-value': {
            color: '#AAA',
          },
        },
      },
    }),
    [],
  );

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <PieChart
        series={[
          {
            data,
            innerRadius: 60,
            outerRadius: 100,
            paddingAngle: 0,
            cornerRadius: 0,
            cx: 150,
            cy: 110,
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            valueFormatter: (item) => formatCurrency(item.value),
          },
        ]}
        sx={CHART_SX}
        width={300}
        height={268}
        slotProps={slotProps}
      />
    </div>
  );
};
