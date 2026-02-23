import type { DashboardStats } from '../@types/api';
import { api } from './axios';

export const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<DashboardStats>('/dashboard_stats');
    return data;
  },
};
