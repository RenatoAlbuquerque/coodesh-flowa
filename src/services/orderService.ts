import { api } from './axios';
import type { AvailableAsset, Order, OrderHistory } from '../@types/api';

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const { data } = await api.get<Order[]>('/orders');
    return data;
  },

  availableAssets: async (): Promise<AvailableAsset[]> => {
    const { data } = await api.get<AvailableAsset[]>('/available_assets');
    return data;
  },

  saveOrder: (order: Order) => api.post('/orders', order),

  updateOrder: (id: string, updates: Partial<Order>) =>
    api.patch(`/orders/${id}`, updates),

  logEvent: (event: Omit<OrderHistory, 'id'>) => api.post('/history', event),

  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${orderId}`, {
      status: 'Cancelada',
    });
    return response.data;
  },
};
