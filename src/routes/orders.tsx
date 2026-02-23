import { createFileRoute } from '@tanstack/react-router';
import { OrdersPage } from '../features/orders';
import { orderService } from '../services/orderService';
import { useOrderStore } from '../store/useOrderStore';
import { useOrderFilters } from '../store/useOrderFilters';
import type { IResponseOrders } from '../@types/api';
import { toast } from 'react-toastify';

export const Route = createFileRoute('/orders')({
  beforeLoad: () => {
    document.title = 'Ordens 🧾 | FlowaStock';
  },

  loader: async () => {
    try {
      const filters = useOrderFilters.getState().filters;

      const [orders, assets] = await Promise.all([
        orderService.getAllOrders(filters),
        orderService.availableAssets(),
      ]);

      const store = useOrderStore.getState();
      store.setOrders(orders as IResponseOrders);
      store.setAvailableAssets(assets);

      return { orders, assets };
    } catch {
      toast.error('Falha ao carregar dados das Ordens');
    }
  },

  component: () => <OrdersPage />,
});
