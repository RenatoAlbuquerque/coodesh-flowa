import { api } from './axios';
import type { AvailableAsset } from '../@types/api';

export const assetsService = {
  availableAssets: async (): Promise<AvailableAsset[]> => {
    const { data } = await api.get<AvailableAsset[]>('/available_assets');
    return data;
  },
};
