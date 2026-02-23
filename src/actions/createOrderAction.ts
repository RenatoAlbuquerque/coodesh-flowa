import { toast } from 'react-toastify';
import type { Order } from '../@types/api';
import type { OrderState } from '../store/useOrderStore';
import { orderService } from '../services/orderService';
import { calculateOrderExecution } from '../api/engine/calculateOrderExecution';

export const createOrderAction = async (
  formData: Omit<
    Order,
    'id' | 'status' | 'remainingQuantity' | 'createdAt' | 'currentPrice'
  >,
  get: () => OrderState,
  set: (
    partial: Partial<OrderState> | ((state: OrderState) => Partial<OrderState>),
  ) => void,
) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const orders = await orderService.getAllOrders();
  const result = calculateOrderExecution(formData, orders as Order[]);
  const orderId = `ORD-${Math.floor(Math.random() * 9000 + 1000)}`;
  const now = new Date().toISOString();

  try {
    if (result) {
      await orderService.saveOrder({
        ...formData,
        id: orderId,
        status: result.status,
        remainingQuantity: result?.remainingQuantity,
        owner: 'Renato Abreu',
        createdAt: now,
        currentPrice: formData.price,
      });
    }

    const orderValue = formData.quantity * formData.price;

    if (formData.side === 'COMPRA') {
      await get().updateDashboardBalance(orderValue, 'COMPRA');
    } else if (formData.side === 'VENDA' && result.hasMatch) {
      const executedQty = formData.quantity - result.remainingQuantity;
      const executedValue = executedQty * formData.price;

      if (executedValue > 0) {
        await get().updateDashboardBalance(executedValue, 'VENDA');
      }
    }

    await orderService.logEvent({
      orderId,
      instrument: formData.instrument,
      eventType: 'Ordem Criada',
      details: `Ordem de ${formData.side} inserida`,
      origin: 'Renato Abreu',
      timestamp: now,
    });

    if (result.hasMatch && result.match) {
      const executedQty = formData.quantity - result.remainingQuantity;
      const matchNow = new Date().toISOString();

      await orderService.logEvent({
        orderId,
        instrument: formData.instrument,
        eventType:
          result.status === 'Executada' ? 'Execução Total' : 'Execução Parcial',
        details: `${formData.side} de ${executedQty} @ R$ ${result.match.price} contra ${result.match.id}`,
        origin: 'Sistema de Matching',
        timestamp: matchNow,
      });

      await orderService.updateOrder(result.match.id, result.counterpartUpdate);

      await orderService.logEvent({
        orderId: result.match.id,
        instrument: result.match.instrument,
        eventType:
          result.counterpartUpdate.status === 'Executada'
            ? 'Execução Total'
            : 'Execução Parcial',
        details: `Execução contra ${orderId} (${executedQty} @ R$ ${result.match.price})`,
        origin: 'Sistema de Matching',
        timestamp: matchNow,
      });

      toast.info(`Match instantâneo em ${formData.instrument}!`);
    }

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
  } catch {
    toast.error('❌ Falha ao conectar com o servidor.');
    set({ error: 'Falha ao processar ordem no servidor.' });
  }
};
