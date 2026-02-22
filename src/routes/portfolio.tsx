import { createFileRoute } from '@tanstack/react-router';
import { PortfolioPage } from '../features/portfolio';
import { portfolioService } from '../services/portfolioService';
import { orderService } from '../services/orderService';
import { assetsService } from '../services/assetsService';

export const Route = createFileRoute('/portfolio')({
  beforeLoad: () => {
    document.title = 'Portfólio 💼 | FlowaStock';
  },

  loader: async () => {
    try {
      const [stats, ordersResponse, assets] = await Promise.all([
        portfolioService.getDashboardStats(),
        orderService.getAllOrders({ _per_page: 1000, _page: 1 }),
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
    } catch (error) {
      console.error('Erro ao carregar dados do portfólio:', error);
      throw new Error('Falha ao carregar portfólio');
    }
  },

  component: () => <PortfolioPage />,
});
