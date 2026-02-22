import { api } from './axios';
import type { OrderHistory } from '../@types/api';
import { cleanParams } from '../utils/filterAttributes';
import type { HistoryFilterData } from '../features/history/HistoryFilter/helperHistoryFilter';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const historyService = {
  getAll: async (filters?: HistoryFilterData): Promise<OrderHistory[]> => {
    const cleaned = filters ? cleanParams(filters) : {};
    const { startDate, endDate, ...apiParams } = cleaned;

    const { data } = await api.get<OrderHistory[]>('/history', {
      params: apiParams,
    });

    if (!startDate && !endDate) return data;

    return data.filter((item) => {
      const itemDate = dayjs(item.timestamp);

      const start = startDate
        ? dayjs(startDate).startOf('day')
        : dayjs('1900-01-01');

      const end = endDate ? dayjs(endDate).endOf('day') : dayjs().endOf('day');

      return itemDate.isBetween(start, end, null, '[]');
    });
  },
};
