import { api } from './axios';
import type {
  DashboardStats,
  Order,
  AvailableAsset,
  AssetType,
} from '../@types/api';
import type { IPortfolioResponse } from '../@types/portfolio';

interface IPositionAccumulator {
  symbol: string;
  type: AssetType;
  quantity: number;
  totalCost: number;
  currentPrice: number;
}

export const portfolioService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<DashboardStats>('/dashboard_stats');
    return data;
  },

  getAllocationData: (
    stats: DashboardStats,
    orders: Order[],
    assets: AvailableAsset[],
  ) => {
    const totals = orders.reduce(
      (acc, order) => {
        if (['Executada', 'Parcial'].includes(order.status)) {
          const assetInfo = assets.find((a) => a.symbol === order.instrument);
          const type = assetInfo?.type || 'Outros';
          const filledQty = order.quantity - order.remainingQuantity;

          const value = filledQty * order.price;
          if (order.side === 'COMPRA') {
            acc[type] = (acc[type] || 0) + value;
          } else {
            acc[type] = (acc[type] || 0) - value;
          }
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    totals['Caixa'] = stats.saldo_disponivel;
    return totals;
  },

  getMyPositions: (
    orders: Order[],
    assets: AvailableAsset[],
  ): IPortfolioResponse[] => {
    const positionsMap: Record<string, IPositionAccumulator> = {};

    const sortedOrders = [...orders].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    sortedOrders.forEach((order) => {
      if (!['Executada', 'Parcial'].includes(order.status)) return;

      const symbol = order.instrument;
      const filledQty = order.quantity - order.remainingQuantity;

      if (!positionsMap[symbol]) {
        positionsMap[symbol] = {
          symbol,
          type: assets.find((a) => a.symbol === symbol)?.type || 'Ações',
          quantity: 0,
          totalCost: 0,
          currentPrice: order.currentPrice || order.price,
        };
      }

      const pos = positionsMap[symbol];

      if (order.side === 'COMPRA') {
        pos.quantity += filledQty;
        pos.totalCost += filledQty * order.price;
      } else {
        const currentAvg = pos.totalCost / pos.quantity;
        pos.quantity -= filledQty;
        pos.totalCost -= filledQty * currentAvg;
      }
    });

    return Object.values(positionsMap)
      .filter((pos) => pos.quantity > 0)
      .map((pos) => {
        const avgPrice = pos.totalCost / pos.quantity;
        const totalValue = pos.quantity * pos.currentPrice;
        const profitPercent = ((pos.currentPrice - avgPrice) / avgPrice) * 100;

        return {
          ...pos,
          id: pos.symbol,
          avgPrice,
          totalValue,
          profitPercent: isNaN(profitPercent) ? 0 : profitPercent,
        };
      });
  },
};
