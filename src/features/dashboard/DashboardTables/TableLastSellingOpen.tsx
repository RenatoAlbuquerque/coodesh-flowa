import React from 'react';
import { Box, Typography, Divider, Chip } from '@mui/material';
import { Route } from '../../../routes';
import { formatCurrency } from '../../../utils/formatNumber';
import type { Order } from '../../../@types/api';

export const TableLastSellingOpen = () => {
  const { ordersLatestSellingOpen } = Route.useLoaderData();

  return (
    <Box>
      {ordersLatestSellingOpen?.map((order: Order, index: number) => (
        <React.Fragment key={order.id}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
            }}
          >
            <Box>
              <Typography variant="body1" fontWeight={700} color="#334155">
                {order.instrument}
              </Typography>
              <Typography variant="body2" color="#94a3b8">
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
                  fontWeight: 600,
                  backgroundColor:
                    order.status === 'Parcial' ? '#fff3e0' : '#f1f5f9',
                  color: order.status === 'Parcial' ? '#ef6c00' : '#5E616A',
                }}
              />
              <Typography variant="caption" color="#94a3b8">
                Qtd: {order.quantity} | Resta: {order.remainingQuantity}
              </Typography>
            </Box>
          </Box>

          {index < ordersLatestSellingOpen.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Box>
  );
};
