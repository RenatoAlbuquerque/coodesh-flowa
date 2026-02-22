import { useMemo } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Route } from '../../../routes';
import { formatCurrency } from '../../../utils/formatNumber';
import type { DatasetElementType } from '@mui/x-charts/internals';
import type { IEvolutionPortfolio } from '../../../@types/portfolio';

const COLOR_A = '#0A68FE';
const COLOR_B = '#54a0ff';

const CHART_SX = {
  '& .MuiBarElement-root:nth-of-type(even)': {
    fill: COLOR_B,
  },
  '& .MuiBarElement-root:nth-of-type(odd)': {
    fill: COLOR_A,
  },
};

export const ChartBarPortfolio = () => {
  const { stats } = Route.useLoaderData();

  const chartData: IEvolutionPortfolio[] = useMemo(
    () => stats?.evolucao_patrimonial || [],
    [stats],
  );

  const xAxisConfig = useMemo(
    () => [
      {
        dataKey: 'data' as const,
        scaleType: 'band' as const,
        tickPlacement: 'middle' as const,
        tickLabelPlacement: 'middle' as const,
      },
    ],
    [],
  );

  const yAxisConfig = useMemo(
    () => [
      {
        width: 80,
        valueFormatter: (value: number) => `R$ ${value / 1000}k`,
      },
    ],
    [],
  );

  const seriesConfig = useMemo(
    () => [
      {
        dataKey: 'valor',
        valueFormatter: (val: number | null) =>
          val ? formatCurrency(val) : 'R$ 0,00',
        color: COLOR_A,
      },
    ],
    [],
  );

  const slotProps = useMemo(
    () => ({
      tooltip: {
        sx: {
          '& .MuiChartsTooltip-paper': {
            backgroundColor: '#ffffff',
            color: '#000000',
            borderRadius: '8px',
            border: '1px solid #334155',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
        },
      },
    }),
    [],
  );

  return (
    <div style={{ width: '100%' }}>
      <BarChart
        dataset={chartData as unknown as DatasetElementType<unknown>[]}
        xAxis={xAxisConfig}
        yAxis={yAxisConfig}
        series={seriesConfig}
        sx={CHART_SX}
        slotProps={slotProps}
        height={300}
        margin={{ left: 0, right: 0, top: 40, bottom: 0 }}
      />
    </div>
  );
};
