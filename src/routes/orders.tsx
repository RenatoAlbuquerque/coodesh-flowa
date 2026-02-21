import { createFileRoute } from '@tanstack/react-router';
import { OrdersPage } from '../features/orders';
import { fetchOrders } from '../service/api';

export const Route = createFileRoute('/orders')({
  beforeLoad: () => {
    document.title = 'Ordens 🧾 | FlowaStock';
  },

  loader: () => fetchOrders(),

  component: () => <OrdersPage />,
});
