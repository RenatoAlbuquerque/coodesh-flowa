import { api } from './axios';
import type { IResponseHistory, OrderHistory } from '../@types/api';
import { cleanParams } from '../utils/filterAttributes';
import type { HistoryFilterData } from '../features/history/HistoryFilter/helperHistoryFilter';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const historyService = {
  getAllHistory: async (
    filters?: HistoryFilterData,
  ): Promise<IResponseHistory | OrderHistory[]> => {
    const cleaned = filters ? cleanParams(filters) : {};

    const { startDate, endDate, _page, _per_page, ...apiParams } = cleaned;

    const params: Record<string, unknown> = {
      ...apiParams,
      _page,
      _per_page,
    };

    if (startDate) {
      params.timestamp_gte = dayjs(startDate).startOf('day').toISOString();
    }
    if (endDate) {
      params.timestamp_lte = dayjs(endDate).endOf('day').toISOString();
    }

    const { data } = await api.get<IResponseHistory | OrderHistory[]>(
      '/history',
      { params },
    );

    return data;
  },
};
