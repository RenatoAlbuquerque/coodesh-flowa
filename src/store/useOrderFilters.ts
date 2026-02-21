import { create } from 'zustand';
import type { OrderFilterData } from '../features/orders/OrderFilter/helperOrderFilter';

interface OrderFiltersStore {
  filters: OrderFilterData;
  setFilters: (filters: OrderFilterData) => void;
  resetFilters: () => void;
}

const initialFilters: OrderFilterData = {
  orderId: '',
  instrument: null,
  side: null,
  status: null,
  date: null,
};

export const useOrderFilters = create<OrderFiltersStore>((set) => ({
  filters: initialFilters,
  setFilters: (newFilters) => set({ filters: newFilters }),
  resetFilters: () => set({ filters: initialFilters }),
}));
