import { create } from 'zustand';
import type { OrderHistory } from '../@types/api';
import { useHistoryFilters } from './useHistoryFilter';
import { historyService } from '../services/historyService';

interface HistoryState {
  ordersHistory: OrderHistory[];
  isLoading: boolean;
  error: string | null;
  setHistory: (orders: OrderHistory[]) => void;
  getHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  ordersHistory: [],
  availableAssets: [],
  isLoading: false,
  error: null,

  setHistory: (ordersHistory) => set({ ordersHistory }),

  getHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = useHistoryFilters.getState().filters;

      const ordersHistory = await historyService.getAll(currentFilters);

      set({ ordersHistory, isLoading: false });
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : 'Erro ao carregar histórico de ventos',
        isLoading: false,
      });
    }
  },
}));
