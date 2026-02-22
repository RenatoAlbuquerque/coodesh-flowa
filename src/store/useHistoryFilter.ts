import { create } from 'zustand';
import type { HistoryFilterData } from '../features/history/HistoryFilter/helperHistoryFilter';

interface HistoryFiltersStore {
  filters: HistoryFilterData;
  setFilters: (filters: HistoryFilterData) => void;
  resetFilters: () => void;
}

const initialFilters: HistoryFilterData = {
  orderId: '',
  instrument: null,
  eventType: null,
  startDate: null,
  endDate: null,
};

export const useHistoryFilters = create<HistoryFiltersStore>((set) => ({
  filters: initialFilters,
  setFilters: (newFilters) => set({ filters: newFilters }),
  resetFilters: () => set({ filters: initialFilters }),
}));
