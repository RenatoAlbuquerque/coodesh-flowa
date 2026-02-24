import { api } from './axios';
import type { IResponseOrders, Order, OrderHistory } from '../@types/api';
import type { OrderFilterData } from '../features/orders/OrderFilter/helperOrderFilter';
import { cleanParams } from '../utils/filterAttributes';
import dayjs from 'dayjs';

export const orderService = {
  getAllOrders: async (
    filters?: OrderFilterData,
  ): Promise<IResponseOrders | Order[]> => {
    const cleaned = filters ? cleanParams(filters) : {};

    const { orderId, date, status, ...rest } = cleaned;
    const params: Record<string, unknown> = { ...rest };

    if (orderId) {
      params.id = orderId;
    }

    if (status) {
      if (Array.isArray(status)) {
        params['status:in'] = status.join(',');
      } else {
        params.status = status;
      }
    }

    if (date) {
      params.createdAt_gte = dayjs(date).startOf('day').toISOString();
      params.createdAt_lte = dayjs(date).endOf('day').toISOString();
    }

    const { data } = await api.get<IResponseOrders | Order[]>('/orders', {
      params,
    });
    return data;
  },

  saveOrder: (order: Order) => api.post('/orders', order),

  updateOrder: (id: string, updates: Partial<Order>) =>
    api.patch(`/orders/${id}`, updates),

  logEvent: (event: Omit<OrderHistory, 'id'>) => api.post('/history', event),

  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${orderId}`, {
      createdAt: new Date().toISOString(),
      status: 'Cancelada',
      remainingQuantity: 0,
    });
    return response.data;
  },
};
