import { Box, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Route } from '../../../routes/portfolio';

export const PortfolioAllocation = () => {
  const { allocation }: { allocation: Record<string, number> } =
    Route.useLoaderData();

  const allocationData = useMemo(() => {
    const totalValue = Object.values(allocation).reduce(
      (acc: number, val: number) => acc + (Number(val) || 0),
      0,
    );

    const configs = [
      { key: 'Ações', label: 'Ações', color: '#3B82F6' },
      { key: 'FIIs', label: 'Fundos Imobiliários', color: '#8B5CF6' },
      { key: 'Renda Fixa', label: 'Renda Fixa', color: '#10B981' },
      { key: 'Caixa', label: 'Saldo Disponível', color: '#F59E0B' },
    ];

    return configs
      .map((config) => {
        const rawValue = allocation[config.key] || 0;
        const percentage = totalValue > 0 ? (rawValue / totalValue) * 100 : 0;

        return {
          label: config.label,
          value: Number(percentage.toFixed(1)),
          color: config.color,
        };
      })
      .filter((item) => item.value > 0);
  }, [allocation]);

  return (
    <Box
      flex={1}
      bgcolor="white"
      borderRadius="8px"
      border="1px solid #00000016"
      p="24px"
      display="flex"
      flexDirection="column"
      gap="24px"
    >
      <Typography
        color="text.primary"
        variant="h2"
        fontWeight={600}
        textAlign={{ xs: 'center', sm: 'start' }}
      >
        Alocação por Classe de Ativo
      </Typography>

      <Box
        sx={{
          height: 12,
          width: '100%',
          display: 'flex',
          borderRadius: '6px',
          overflow: 'hidden',
          bgcolor: '#F1F5F9',
        }}
      >
        {allocationData.map((item) => (
          <Box
            key={item.label}
            sx={{
              width: `${item.value}%`,
              bgcolor: item.color,
              transition: 'width 0.5s ease-in-out',
            }}
          />
        ))}
      </Box>

      <Stack
        direction="row"
        spacing={4}
        flexWrap="wrap"
        justifyContent={{ xs: 'center', sm: 'flex-start' }}
        gap="10px"
      >
        {allocationData.map((item) => (
          <Stack
            key={item.label}
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: item.color,
              }}
            />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {item.label}
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight={700}>
              {item.value}%
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};
