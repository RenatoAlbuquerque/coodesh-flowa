import { create } from 'zustand';
import type { OrderFilterData } from '../features/orders/OrderFilter/helperOrderFilter';

interface OrderFiltersStore {
  filters: OrderFilterData;
  setFilters: (filters: OrderFilterData) => void;
  resetFilters: () => void;
  setPagination: (page: number, pageSize: number) => void;
}

const initialFilters: OrderFilterData = {
  orderId: '',
  instrument: null,
  side: null,
  status: null,
  date: null,
  _page: 1,
  _per_page: 5,
};

export const useOrderFilters = create<OrderFiltersStore>((set) => ({
  filters: initialFilters,
  setFilters: (newFilters) =>
    set({
      filters: { ...newFilters, _page: 1, _per_page: 5 },
    }),
  setPagination: (page: number, pageSize: number) =>
    set((state) => ({
      filters: { ...state.filters, _page: page, _per_page: pageSize },
    })),
  resetFilters: () => set({ filters: initialFilters }),
}));
