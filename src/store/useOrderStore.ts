import { create } from 'zustand';
import type { Order, AvailableAsset, IResponseOrders } from '../@types/api';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';
import { useOrderFilters } from './useOrderFilters';
import { api } from '../services/axios';
import type { IPortfolioStatusResponse } from '../@types/portfolio';
import { assetsService } from '../services/assetsService';
import { dashboardService } from '../services/dashboardService';
import { createOrderAction } from '../actions/createOrderAction';
import { cancelOrderAction } from '../actions/cancelOrderAction';

export interface OrderState {
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
      const response = await orderService.getAllOrders({
        ...currentFilters,
        _sort: '-createdAt',
      });

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
    } catch {
      toast.error('Erro ao buscar ativos disponíveis:');
    }
  },

  createOrder: (formData) => createOrderAction(formData, get, set),

  cancelOrder: (order) => cancelOrderAction(order, get, set),

  updateDashboardBalance: async (value, type) => {
    try {
      const stats = await dashboardService.getDashboardStats();
      let newSaldo = stats.saldo_disponivel;
      let newInvestido = stats.valor_investido;

      if (type === 'COMPRA') {
        newSaldo -= value;
        newInvestido += value;
      } else if (type === 'VENDA' || type === 'CANCELAMENTO_COMPRA') {
        newSaldo += value;
        newInvestido -= value;
      }

      const newTotal = newSaldo + newInvestido;

      await api.patch('/dashboard_stats', {
        saldo_disponivel: newSaldo,
        valor_investido: newInvestido,
        patrimonio_total: newTotal,
      });

      set((state) => ({
        stats: {
          ...state.stats,
          saldo_disponivel: newSaldo,
          valor_investido: newInvestido,
          patrimonio_total: newTotal,
        },
      }));
    } catch (err) {
      console.error('Erro ao atualizar dashboard:', err);
    }
  },

  getStats: async () => {
    const data = await dashboardService.getDashboardStats();
    set({ stats: data });
  },
}));
