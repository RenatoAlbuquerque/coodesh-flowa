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
  getAllocationData: (
    stats: DashboardStats,
    orders: Order[],
    assets: AvailableAsset[],
  ) => {
    const positions = portfolioService.getMyPositions(orders, assets);

    const totals = positions.reduce(
      (acc, pos) => {
        const value = Math.abs(pos.totalValue);
        if (value > 0) {
          acc[pos.type] = (acc[pos.type] || 0) + value;
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

    const myOrders = orders.filter((o) => o.owner !== 'Mercado');

    const sortedOrders = [...myOrders].sort(
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
      pos.currentPrice = order.currentPrice || order.price;

      if (order.side === 'COMPRA') {
        pos.quantity += filledQty;
        pos.totalCost += filledQty * order.price;
      } else {
        const currentAvg =
          pos.quantity > 0 ? pos.totalCost / pos.quantity : order.price;

        pos.quantity -= filledQty;
        pos.totalCost -= filledQty * currentAvg;

        if (pos.quantity === 0) {
          pos.totalCost = 0;
        }
      }
    });

    return Object.values(positionsMap)
      .filter((pos) => pos.quantity !== 0)
      .map((pos) => {
        const isShort = pos.quantity < 0;
        const avgPrice = pos.totalCost / pos.quantity;
        const totalValue = pos.quantity * pos.currentPrice;

        const profitPercent =
          avgPrice === 0
            ? 0
            : isShort
              ? ((avgPrice - pos.currentPrice) / avgPrice) * 100
              : ((pos.currentPrice - avgPrice) / avgPrice) * 100;

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
