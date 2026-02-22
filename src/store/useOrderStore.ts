import { create } from 'zustand';
import type { Order, AvailableAsset, IResponseOrders } from '../@types/api';
import { orderService } from '../services/orderService';
import { calculateOrderExecution } from '../api/engine/calculateOrderExecution';
import { toast } from 'react-toastify';
import { useOrderFilters } from './useOrderFilters';
import { api } from '../services/axios';
import { portfolioService } from '../services/portfolioService';
import type { IPortfolioStatusResponse } from '../@types/portfolio';
import { assetsService } from '../services/assetsService';

interface OrderState {
  orders: IResponseOrders;
  availableAssets: AvailableAsset[];
  isLoading: boolean;
  error: string | null;

  setOrders: (orders: IResponseOrders) => void;
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

  stats: IPortfolioStatusResponse;
  getStats: () => Promise<void>;

  updateDashboardBalance: (
    value: number,
    type: 'COMPRA' | 'VENDA' | 'CANCELAMENTO_COMPRA',
  ) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: { data: [], items: 0, first: 0, last: 0, next: 0, pages: 0 },
  availableAssets: [],
  isLoading: false,
  error: null,
  stats: {
    evolucao_patrimonial: [],
    patrimonio_total: 0,
    rentabilidade_mes: 0,
    saldo_disponivel: 0,
    valor_investido: 0,
    variacao_diaria_percent: 0,
  },

  setOrders: (orders) => set({ orders }),

  setAvailableAssets: (assets) => set({ availableAssets: assets }),

  getOrders: async () => {
    const currentFilters = useOrderFilters.getState().filters;
    set({ isLoading: true, error: null });

    try {
      const response = await orderService.getAllOrders(currentFilters);

      const ordersData = Array.isArray(response)
        ? {
            data: response,
            items: response.length,
            first: 0,
            last: 0,
            next: 0,
            pages: 0,
          }
        : response;

      set({ orders: ordersData, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Erro ao carregar ordens',
        isLoading: false,
      });
    }
  },

  getAvailableAssets: async () => {
    try {
      const data = await assetsService.availableAssets();
      set({ availableAssets: data });
    } catch (err) {
      console.error('Erro ao buscar ativos disponíveis:', err);
    }
  },

  createOrder: async (formData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const currentFilters = useOrderFilters.getState().filters;

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
          createdAt: now,
          currentPrice: formData.price,
        });
      }

      const orderValue = formData.quantity * formData.price;

      if (formData.side === 'COMPRA') {
        await get().updateDashboardBalance(orderValue, 'COMPRA');
      } else if (
        formData.side === 'VENDA' &&
        (result.status === 'Executada' || result.status === 'Parcial')
      ) {
        const executedQty = formData.quantity - result.remainingQuantity;
        const executedValue = executedQty * formData.price;
        if (executedValue > 0) {
          await get().updateDashboardBalance(executedValue, 'VENDA');
        }
      }

      if (result.hasMatch && result.match) {
        if (result.match.side === 'VENDA') {
          const executedQty =
            result.match.remainingQuantity -
            result.counterpartUpdate.remainingQuantity;
          const executedValue = executedQty * result.match.price;

          if (executedValue > 0) {
            await get().updateDashboardBalance(executedValue, 'VENDA');
          }
        }
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

      const freshOrders = await orderService.getAllOrders(currentFilters);

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
      toast.error('❌ Falha ao conectar com o servidor.');
      set({ error: 'Falha ao processar ordem no servidor.' });
      console.error(err);
    }
  },

  cancelOrder: async (order: Order) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const currentFilters = useOrderFilters.getState().filters;

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

      const freshOrders = await orderService.getAllOrders(currentFilters);

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
  },

  updateDashboardBalance: async (
    value: number,
    type: 'COMPRA' | 'VENDA' | 'CANCELAMENTO_COMPRA',
  ) => {
    try {
      const stats = await portfolioService.getDashboardStats();
      let newSaldo = stats.saldo_disponivel;
      let newInvestido = stats.valor_investido;

      if (type === 'COMPRA') {
        newSaldo -= value;
        newInvestido += value;
      } else if (type === 'VENDA') {
        newSaldo += value;
        newInvestido -= value;
      } else if (type === 'CANCELAMENTO_COMPRA') {
        newSaldo += value;
        newInvestido -= value;
      }

      await api.patch('/dashboard_stats', {
        saldo_disponivel: newSaldo,
        valor_investido: newInvestido,
        patrimonio_total: newSaldo + newInvestido,
      });
    } catch (err) {
      console.error('Erro ao atualizar dashboard:', err);
    }
  },

  getStats: async () => {
    const data = await portfolioService.getDashboardStats();
    set({ stats: data });
  },
}));
