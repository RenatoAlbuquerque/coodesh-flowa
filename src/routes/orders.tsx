import { createFileRoute } from '@tanstack/react-router';
import { OrdersPage } from '../features/orders';
import { orderService } from '../services/orderService';
import { useOrderStore } from '../store/useOrderStore';

export const Route = createFileRoute('/orders')({
  beforeLoad: () => {
    document.title = 'Ordens 🧾 | FlowaStock';
  },

  loader: async () => {
    try {
      const [orders, assets] = await Promise.all([
        orderService.getAll(),
        orderService.availableAssets(),
      ]);

      const store = useOrderStore.getState();
      store.setOrders(orders);

      if ('setAvailableAssets' in store) {
        store.setAvailableAssets(assets);
      }

      return { orders, assets };
    } catch (error) {
      console.error(error);
      throw new Error('Não foi possível conectar ao servidor de dados.');
    }
  },

  component: () => <OrdersPage />,
});
