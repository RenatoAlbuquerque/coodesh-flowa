import { createFileRoute } from '@tanstack/react-router';
import { PortfolioPage } from '../features/portfolio';
import { portfolioService } from '../services/portfolioService';
import { orderService } from '../services/orderService';
import { assetsService } from '../services/assetsService';
import { toast } from 'react-toastify';
import { dashboardService } from '../services/dashboardService';

export const Route = createFileRoute('/portfolio')({
  beforeLoad: () => {
    document.title = 'Portfólio 💼 | FlowaStock';
  },

  loader: async () => {
    try {
      const [stats, ordersResponse, assets] = await Promise.all([
        dashboardService.getDashboardStats(),
        orderService.getAllOrders(),
        assetsService.availableAssets(),
      ]);

      const orders = Array.isArray(ordersResponse)
        ? ordersResponse
        : ordersResponse.data;

      const allocation = portfolioService.getAllocationData(
        stats,
        orders,
        assets,
      );
      const positions = portfolioService.getMyPositions(orders, assets);

      return {
        stats,
        allocation,
        positions,
        assets,
      };
    } catch {
      toast.error('Erro ao carregar dados do portfólio');
    }
  },

  component: () => <PortfolioPage />,
});
