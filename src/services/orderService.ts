import { api } from './axios';
import type { AvailableAsset, Order, OrderHistory } from '../@types/api';
import type { OrderFilterData } from '../features/orders/OrderFilter/helperOrderFilter';
import { cleanParams } from '../utils/filterAttributes';

export const orderService = {
  getAll: async (filters?: OrderFilterData): Promise<Order[]> => {
    const params = filters ? cleanParams(filters) : {};

    const { data } = await api.get<Order[]>('/orders', { params });
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
      remainingQuantity: 0,
    });
    return response.data;
  },
};
