import { createFileRoute } from '@tanstack/react-router';
import { HistoryPage } from '../features/history';
import { orderService } from '../services/orderService';
import { useOrderStore } from '../store/useOrderStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useHistoryFilters } from '../store/useHistoryFilter';
import { historyService } from '../services/historyService';

export const Route = createFileRoute('/history')({
  beforeLoad: () => {
    document.title = 'Histórico 📑 | FlowaStock';
  },
  loader: async () => {
    try {
      const filters = useHistoryFilters.getState().filters;
      const orderStore = useOrderStore.getState();
      const historyStore = useHistoryStore.getState();

      const assetsPromise =
        orderStore.availableAssets.length === 0
          ? orderService.availableAssets()
          : Promise.resolve(orderStore.availableAssets);

      const historyPromise = historyService.getAll(filters);

      const [assets, historyList] = await Promise.all([
        assetsPromise,
        historyPromise,
      ]);

      orderStore.setAvailableAssets(assets);
      historyStore.setHistory(historyList);

      return { assets, historyList };
    } catch (error) {
      console.error(error);
      throw new Error('Falha ao carregar dados do histórico');
    }
  },
  component: () => <HistoryPage />,
});
