import { create } from 'zustand';
import type { HistoryFilterData } from '../features/history/HistoryFilter/helperHistoryFilter';

interface HistoryFiltersStore {
  filters: HistoryFilterData;
  setFilters: (filters: HistoryFilterData) => void;
  resetFilters: () => void;
  setPagination: (page: number, pageSize: number) => void;
}

const initialFilters: HistoryFilterData = {
  orderId: '',
  instrument: null,
  eventType: null,
  startDate: null,
  endDate: null,
  _page: 1,
  _per_page: 5,
  _sort: '-timestamp',
};

export const useHistoryFilters = create<HistoryFiltersStore>((set) => ({
  filters: initialFilters,
  setFilters: (newFilters) =>
    set({
      filters: { ...newFilters, _page: 1, _per_page: 5, _sort: '-timestamp' },
    }),
  setPagination: (page: number, pageSize: number) =>
    set((state) => ({
      filters: { ...state.filters, _page: page, _per_page: pageSize },
    })),
  resetFilters: () => set({ filters: initialFilters }),
}));
