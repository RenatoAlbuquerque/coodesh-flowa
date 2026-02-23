import { createFileRoute } from '@tanstack/react-router';
import { portfolioService } from '../services/portfolioService';
import { orderService } from '../services/orderService';
import type { Order } from '../@types/api';
import { DashboardPage } from '../features/dashboard';
import { assetsService } from '../services/assetsService';
import { toast } from 'react-toastify';
import { dashboardService } from '../services/dashboardService';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    document.title = 'Dashboard 📊 | FlowaStock';
  },
  loader: async () => {
    try {
      const [stats, ordersList, assets] = await Promise.all([
        dashboardService.getDashboardStats(),
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

      const dataLatest = await orderService.getAllOrders({
        _sort: '-createdAt',
        _page: 1,
        _per_page: 3,
      });

      const ordersLatest =
        typeof dataLatest === 'object' && 'data' in dataLatest
          ? dataLatest.data
          : dataLatest;

      const dataLatestSellingOpen = await orderService.getAllOrders({
        status: ['Aberta', 'Parcial'] as unknown as string,
        side: 'VENDA',
        _sort: '-createdAt',
        _page: 1,
        _per_page: 3,
      });

      const ordersLatestSellingOpen =
        typeof dataLatestSellingOpen === 'object' &&
        'data' in dataLatestSellingOpen
          ? dataLatestSellingOpen.data
          : dataLatestSellingOpen;

      return {
        stats,
        allocation,
        positions,
        assets,
        ordersList,
        ordersLatest,
        ordersLatestSellingOpen,
      };
    } catch {
      toast.error('Erro ao carregar dados do portfólio:');
      throw new Error('Falha ao carregar portfólio');
    }
  },

  component: () => <DashboardPage />,
});
