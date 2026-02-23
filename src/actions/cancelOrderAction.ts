import type { Order } from '../@types/api';
import { orderService } from '../services/orderService';
import type { OrderState } from '../store/useOrderStore';

export const cancelOrderAction = async (
  order: Order,
  get: () => OrderState,
  set: (
    partial: Partial<OrderState> | ((state: OrderState) => Partial<OrderState>),
  ) => void,
) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (order.status !== 'Aberta' && order.status !== 'Parcial') {
    set({ error: 'Apenas ordens abertas ou parciais podem ser canceladas.' });
    return;
  }

  try {
    set({ isLoading: true });

    await orderService.cancelOrder(order.id);

    if (order.side === 'COMPRA') {
      const refundValue = order.remainingQuantity * order.price;
      await get().updateDashboardBalance(refundValue, 'CANCELAMENTO_COMPRA');
    }

    await orderService.logEvent({
      orderId: order.id,
      instrument: order.instrument,
      eventType: 'Cancelamento',
      details: `Cancelamento manual da ordem ${order.id}`,
      origin: 'Renato Abreu',
      timestamp: new Date().toISOString(),
    });

    const freshOrders = await orderService.getAllOrders({
      _page: 1,
      _per_page: 5,
      _sort: '-createdAt',
    });

    const ordersData = Array.isArray(freshOrders)
      ? {
          data: freshOrders,
          items: freshOrders.length,
          first: 0,
          last: 0,
          next: 0,
          pages: 0,
        }
      : freshOrders;

    set({ orders: ordersData, isLoading: false });
  } catch (err) {
    set({ error: 'Erro ao cancelar a ordem.', isLoading: false });
    console.error(err);
  }
};
