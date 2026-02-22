import { create } from 'zustand';
import type { Order, AvailableAsset } from '../@types/api';
import { orderService } from '../services/orderService';
import { calculateOrderExecution } from '../api/engine/calculateOrderExecution';
import { toast } from 'react-toastify';
import { useOrderFilters } from './useOrderFilters';

interface OrderState {
  orders: Order[];
  availableAssets: AvailableAsset[];
  isLoading: boolean;
  error: string | null;

  setOrders: (orders: Order[]) => void;
  setAvailableAssets: (assets: AvailableAsset[]) => void;

  getOrders: () => Promise<void>;
  getAvailableAssets: () => Promise<void>;
  createOrder: (
    formData: Omit<
      Order,
      'id' | 'status' | 'remainingQuantity' | 'createdAt' | 'currentPrice'
    >,
  ) => Promise<void>;
  cancelOrder: (order: Order) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  availableAssets: [],
  isLoading: false,
  error: null,

  setOrders: (orders) => set({ orders }),

  setAvailableAssets: (assets) => set({ availableAssets: assets }),

  getOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = useOrderFilters.getState().filters;

      const orders = await orderService.getAll(currentFilters);

      set({ orders, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Erro ao carregar ordens',
        isLoading: false,
      });
    }
  },

  getAvailableAssets: async () => {
    try {
      const data = await orderService.availableAssets();
      set({ availableAssets: data });
    } catch (err) {
      console.error('Erro ao buscar ativos disponíveis:', err);
    }
  },

  createOrder: async (formData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { orders } = get();
    const result = calculateOrderExecution(formData, orders);
    const orderId = `ORD-${Math.floor(Math.random() * 9000 + 1000)}`;
    const now = new Date().toISOString();

    try {
      if (result) {
        await orderService.saveOrder({
          ...formData,
          id: orderId,
          status: result.status,
          remainingQuantity: result?.remainingQuantity,
          createdAt: now,
          currentPrice: formData.price,
        });
      }

      await orderService.logEvent({
        orderId,
        instrument: formData.instrument,
        eventType:
          result.status === 'Executada' ? 'Execução Total' : 'Ordem Criada',
        details: `${formData.side} de ${formData.quantity} @ R$ ${formData.price}`,
        origin: 'Renato Abreu',
        timestamp: now,
      });

      if (result.hasMatch && result.match) {
        await orderService.updateOrder(
          result.match.id,
          result.counterpartUpdate,
        );

        await orderService.logEvent({
          orderId: result.match.id,
          instrument: result.match.instrument,
          eventType:
            result.counterpartUpdate.status === 'Executada'
              ? 'Execução Total'
              : 'Execução Parcial',
          details: `Execução contra ${orderId}`,
          origin: 'Sistema de Matching',
          timestamp: now,
        });

        toast.info(`Match instantâneo em ${formData.instrument}!`);
      }

      const freshOrders = await orderService.getAll();
      set({ orders: freshOrders });
    } catch (err) {
      toast.error('❌ Falha ao conectar com o servidor.');
      set({ error: 'Falha ao processar ordem no servidor.' });
      console.error(err);
    }
  },

  cancelOrder: async (order: Order) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (order.status !== 'Aberta' && order.status !== 'Parcial') {
      set({ error: 'Apenas ordens abertas ou parciais podem ser canceladas.' });
      return;
    }

    try {
      set({ isLoading: true });

      await orderService.cancelOrder(order.id);
      await orderService.logEvent({
        orderId: order.id,
        instrument: order.instrument,
        eventType: 'Cancelamento',
        details: `Cancelamento manual da ordem ${order.id}`,
        origin: 'Renato Abreu',
        timestamp: new Date().toISOString(),
      });

      const freshOrders = await orderService.getAll();
      set({ orders: freshOrders, isLoading: false });
    } catch (err) {
      set({ error: 'Erro ao cancelar a ordem.', isLoading: false });
      console.error(err);
    }
  },
}));
