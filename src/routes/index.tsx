import { createFileRoute } from '@tanstack/react-router';
import { portfolioService } from '../services/portfolioService';
import { orderService } from '../services/orderService';
import type { Order } from '../@types/api';
import { DashboardPage } from '../features/dashboard';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    document.title = 'Dashboard 📊 | FlowaStock';
  },
  loader: async () => {
    try {
      const [stats, ordersList, assets] = await Promise.all([
        portfolioService.getDashboardStats(),
        orderService.getAll(),
        orderService.availableAssets(),
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

      return {
        stats,
        allocation,
        positions,
        assets,
        ordersList,
      };
    } catch (error) {
      console.error('Erro ao carregar dados do portfólio:', error);
      throw new Error('Falha ao carregar portfólio');
    }
  },

  component: () => <DashboardPage />,
});
