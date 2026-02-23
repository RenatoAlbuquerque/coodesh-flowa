import { useMemo, memo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import RealEstateAgentOutlinedIcon from '@mui/icons-material/RealEstateAgentOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { formatCurrency } from '../../../utils/formatNumber';
import { Route } from '../../../routes';
import type { Order } from '../../../@types/api';
import { removerScrollDisplay } from '../../../styles/globalCss';

export const DashboardStats = () => {
  const { stats: data, ordersList = [] } = Route.useLoaderData();

  const statsConfig = useMemo(() => {
    const orders = Array.isArray(ordersList) ? ordersList : [];
    const counts = orders.reduce(
      (acc: { total: number; buy: number; sale: number }, order: Order) => {
        if (order.status === 'Aberta' || order.status === 'Parcial') {
          acc.total++;
          if (order.side === 'COMPRA') acc.buy++;
          if (order.side === 'VENDA') acc.sale++;
        }
        return acc;
      },
      { total: 0, buy: 0, sale: 0 },
    );

    return [
      {
        label: 'Patrimônio Total',
        icon: <RealEstateAgentOutlinedIcon fontSize="small" />,
        value: formatCurrency(data.patrimonio_total),
        description: 'Multiplique seu patrimônio diariamente',
      },
      {
        label: 'Saldo Disponível',
        icon: <AccountBalanceWalletOutlinedIcon fontSize="small" />,
        value: formatCurrency(data.saldo_disponivel),
        description: 'Pronto para investir',
      },
      {
        label: 'Ordens Abertas',
        icon: <TrendingUpOutlinedIcon fontSize="small" />,
        value: counts.total,
        description: `${counts.buy} compras, ${counts.sale} vendas`,
      },
    ];
  }, [data.patrimonio_total, data.saldo_disponivel, ordersList]);

  return (
    <Box
      display="flex"
      width="100%"
      alignItems="center"
      justifyContent="space-between"
      gap="20px"
      mb="32px"
      overflow="auto"
      sx={removerScrollDisplay}
    >
      {statsConfig.map((item) => (
        <StatCard
          key={item.label}
          label={item.label}
          icon={item.icon}
          value={item.value}
          description={item.description}
        />
      ))}
    </Box>
  );
};

interface StatCardProps {
  label: string;
  icon: React.ReactNode;
  value: string | number;
  description: string;
}

const StatCard = memo(({ label, icon, value, description }: StatCardProps) => {
  const {
    palette: { primary },
  } = useTheme();
  return (
    <Box
      flex={1}
      bgcolor="white"
      borderRadius="8px"
      border="1px solid #00000016"
      p="24px"
      display="flex"
      flexDirection="column"
      gap="12px"
      minWidth="300px"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography color="text.disabled" variant="body1">
          {label}
        </Typography>
        <Box
          width="34px"
          height="34px"
          color="white"
          borderRadius="6px"
          bgcolor={primary.main}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Box>
      </Box>
      <Typography
        color="text.primary"
        variant="h1"
        sx={{ fontSize: '1.5rem', fontWeight: 700 }}
      >
        {value}
      </Typography>
      <Typography color="text.disabled" variant="body2">
        {description}
      </Typography>
    </Box>
  );
});
