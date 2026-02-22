import { Box, Typography, Divider, Chip } from '@mui/material';
import { Route } from '../../../routes';
import dayjs from 'dayjs';
import type { Order } from '../../../@types/api';
import React from 'react';
import { formatCurrency } from '../../../utils/formatNumber';

const statusConfig = {
  Executada: { color: '#ffffff', bgColor: '#16a34a', label: 'Executada' },
  Parcial: { color: '#ffffff', bgColor: '#f59e0b', label: 'Parcial' },
  Aberta: { color: '#5E616A', bgColor: '#f1f5f9', label: 'Aberta' },
  Cancelada: { color: '#ffffff', bgColor: '#ef4444', label: 'Cancelada' },
};

export const TableLastOrders = () => {
  const { ordersLatest } = Route.useLoaderData();

  return (
    <Box>
      {ordersLatest?.map((order: Order, index: number) => (
        <React.Fragment key={order.id}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: '16px',
            }}
          >
            <Box>
              <Typography variant="body1" fontWeight={700} color="#334155">
                {order.instrument}
              </Typography>
              <Typography variant="body2" color="#94a3b8">
                {order.side.charAt(0).toUpperCase() +
                  order.side.slice(1).toLowerCase()}{' '}
                • {order.quantity.toLocaleString('pt-BR')} un @{' '}
                {formatCurrency(order.price)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 1,
              }}
            >
              <Chip
                label={order.status}
                size="small"
                sx={{
                  height: '24px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor:
                    statusConfig[order.status as keyof typeof statusConfig]
                      ?.bgColor || '#f1f5f9',
                  color:
                    statusConfig[order.status as keyof typeof statusConfig]
                      ?.color || '#5E616A',
                  px: '10px',
                  '& .MuiChip-label': { px: 1 },
                  '&::before': {
                    content: '""',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor:
                      order.status === 'Executada' ? '#fff' : 'currentColor',
                    display: 'inline-block',
                  },
                }}
              />
              <Typography variant="caption" color="#94a3b8">
                {dayjs(order.createdAt).format('DD/MM/YYYY - HH:mm')}
              </Typography>
            </Box>
          </Box>
          {index < ordersLatest.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Box>
  );
};
