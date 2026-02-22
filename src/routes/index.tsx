import { createFileRoute } from '@tanstack/react-router';
import { portfolioService } from '../services/portfolioService';
import { orderService } from '../services/orderService';
import type { Order } from '../@types/api';
import { DashboardPage } from '../features/dashboard';
import { assetsService } from '../services/assetsService';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    document.title = 'Dashboard 📊 | FlowaStock';
  },
  loader: async () => {
    try {
      const [stats, ordersList, assets] = await Promise.all([
        portfolioService.getDashboardStats(),
        orderService.getAllOrders(),
        assetsService.availableAssets(),
      ]);

      const allocation = portfolioService.getAllocationData(
        stats,
        ordersList as Order[],
        assets,
      );
      const positions = portfolioService.getMyPositions(
        ordersList as Order[],
        assets,
      );

      const ordersLatest = await orderService.getLatestOrders(
        ordersList as Order[],
        3,
      );

      const ordersLatestSellingOpen = await orderService.getLatestSellingOpen(
        ordersList as Order[],
        3,
      );

      return {
        stats,
        allocation,
        positions,
        assets,
        ordersList,
        ordersLatest,
        ordersLatestSellingOpen,
      };
    } catch (error) {
      console.error('Erro ao carregar dados do portfólio:', error);
      throw new Error('Falha ao carregar portfólio');
    }
  },

  component: () => <DashboardPage />,
});
