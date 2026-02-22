import { createFileRoute } from '@tanstack/react-router';
import { HistoryPage } from '../features/history';
import { useOrderStore } from '../store/useOrderStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useHistoryFilters } from '../store/useHistoryFilter';
import { historyService } from '../services/historyService';
import { assetsService } from '../services/assetsService';
import type { IResponseHistory } from '../@types/api';

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
          ? assetsService.availableAssets()
          : Promise.resolve(orderStore.availableAssets);

      const historyPromise = historyService.getAllHistory(filters);

      const [assets, historyList] = await Promise.all([
        assetsPromise,
        historyPromise,
      ]);

      orderStore.setAvailableAssets(assets);
      historyStore.setHistory(historyList as IResponseHistory);

      return { assets, historyList };
    } catch (error) {
      console.error(error);
      throw new Error('Falha ao carregar dados do histórico');
    }
  },
  component: () => <HistoryPage />,
});
