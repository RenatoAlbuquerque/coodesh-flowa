import type { Order } from '../@types/api';

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch('http://localhost:3001/orders');
  if (!response.ok) {
    throw new Error('Erro ao buscar ordens');
  }
  return response.json();
};
