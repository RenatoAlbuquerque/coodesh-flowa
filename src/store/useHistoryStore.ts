import { create } from 'zustand';
import type { IResponseHistory } from '../@types/api';
import { useHistoryFilters } from './useHistoryFilter';
import { historyService } from '../services/historyService';

interface HistoryState {
  ordersHistory: IResponseHistory;
  isLoading: boolean;
  error: string | null;
  setHistory: (orders: IResponseHistory) => void;
  getHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  ordersHistory: { data: [], items: 0, first: 0, last: 0, next: 0, pages: 0 },
  availableAssets: [],
  isLoading: false,
  error: null,

  setHistory: (ordersHistory) => set({ ordersHistory }),

  getHistory: async () => {
    const currentFilters = useHistoryFilters.getState().filters;
    set({ isLoading: true, error: null });
    try {
      const response = await historyService.getAll(currentFilters);

      set({ ordersHistory: response as IResponseHistory, isLoading: false });
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
