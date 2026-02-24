import { useMemo, memo } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import RealEstateAgentOutlinedIcon from '@mui/icons-material/RealEstateAgentOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { formatCurrency } from '../../../utils/formatNumber';
import { Route } from '../../../routes/portfolio';
import { scrollDisplay } from '../../../styles/globalCss';
import type { AvailableAsset, DashboardStats } from '../../../@types/api';

export const PortfolioStats = () => {
  const {
    stats: data,
    positions,
  }: { stats: DashboardStats; positions: AvailableAsset[] } =
    Route.useLoaderData();

  const statsConfig = useMemo(() => {
    const assetCount = positions?.length || 0;
    const balancePercentage =
      data.patrimonio_total > 0
        ? Math.round((data.saldo_disponivel / data.patrimonio_total) * 100)
        : 0;

    return [
      {
        label: 'Patrimônio Total',
        icon: (
          <RealEstateAgentOutlinedIcon fontSize="small" htmlColor="#94A3B8" />
        ),
        value: data.patrimonio_total,
        complement: (
          <Stack direction="row" spacing={1} alignItems="center">
            <Box bgcolor="#DCFCE7" px={1} borderRadius="4px">
              <Typography color="#16A34A" variant="caption" fontWeight={700}>
                +{data.variacao_diaria_percent}%
              </Typography>
            </Box>
            <Typography color="text.disabled" variant="body2">
              vs último mês
            </Typography>
          </Stack>
        ),
      },
      {
        label: 'Saldo Disponível',
        icon: (
          <AccountBalanceWalletOutlinedIcon
            fontSize="small"
            htmlColor="#94A3B8"
          />
        ),
        value: data.saldo_disponivel,
        complement: (
          <Typography color="text.disabled" variant="body2">
            {balancePercentage}% do patrimônio
          </Typography>
        ),
      },
      {
        label: 'Valor Investido',
        icon: <TrendingUpOutlinedIcon fontSize="small" htmlColor="#94A3B8" />,
        value: data.valor_investido,
        complement: (
          <Typography color="text.disabled" variant="body2">
            Em {assetCount} ativos
          </Typography>
        ),
      },
    ];
  }, [data, positions?.length]);

  return (
    <Box
      display="flex"
      width="100%"
      alignItems="center"
      justifyContent="space-between"
      gap="20px"
      mb="32px"
      overflow="auto"
      sx={scrollDisplay}
    >
      {statsConfig.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </Box>
  );
};

const StatCard = memo(
  ({
    label,
    icon,
    value,
    complement,
  }: {
    label: string;
    icon: React.ReactNode;
    value: number;
    complement: React.ReactNode;
  }) => (
    <Box
      flex={1}
      bgcolor="white"
      borderRadius="8px"
      border="1px solid #00000016"
      p="24px"
      display="flex"
      flexDirection="column"
      gap="12px"
      minWidth={'300px'}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography color="text.disabled" variant="body1">
          {label}
        </Typography>
        {icon}
      </Box>
      <Typography color="text.primary" variant="h1" fontWeight={700}>
        {formatCurrency(value)}
      </Typography>
      {complement}
    </Box>
  ),
);
