import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from './axios';
import { assetsService } from './assetsService';
import { dashboardService } from './dashboardService';
import type { AvailableAsset, DashboardStats } from '../@types/api';
import dayjs from 'dayjs';
import { orderService } from './orderService';
import type { OrderFilterData } from '../features/orders/OrderFilter/helperOrderFilter';

vi.mock('./axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api, true);

describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('assetsService', () => {
    it('Buscar ativos disponíveis', async () => {
      const mockAssets: AvailableAsset[] = [
        { id: '1', symbol: 'PETR4', name: 'Petrobras', type: 'Ações' },
        { id: '2', symbol: 'VALE3', name: 'Vale', type: 'Ações' },
      ];

      mockedApi.get.mockResolvedValue({
        data: mockAssets,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      const result = await assetsService.availableAssets();

      expect(mockedApi.get).toHaveBeenCalledWith('/available_assets');
      expect(result).toEqual(mockAssets);
    });

    it('Enviar erro caso a API de ativos falhe', async () => {
      mockedApi.get.mockRejectedValue(new Error('Falha na conexão'));

      await expect(assetsService.availableAssets()).rejects.toThrow(
        'Falha na conexão',
      );
    });
  });

  describe('dashboardService', () => {
    it('Buscar estatísticas do dashboard', async () => {
      const mockStats: DashboardStats = {
        patrimonio_total: 15000,
        saldo_disponivel: 5000,
        valor_investido: 10000,
        rentabilidade_mes: 2.5,
        variacao_diaria_percent: 0.5,
        evolucao_patrimonial: [
          { data: '2026-01-01', valor: 14000 },
          { data: '2026-02-01', valor: 15000 },
        ],
      };

      mockedApi.get.mockResolvedValue({
        data: mockStats,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      const result = await dashboardService.getDashboardStats();

      expect(mockedApi.get).toHaveBeenCalledWith('/dashboard_stats');
      expect(result.patrimonio_total).toBe(15000);
    });

    it('Enviar erro caso a API de dashboard falhe', async () => {
      mockedApi.get.mockRejectedValue(new Error('404 Not Found'));

      await expect(dashboardService.getDashboardStats()).rejects.toThrow(
        '404 Not Found',
      );
    });
  });

  describe('ordersService', () => {
    it('Aplica todos os filtros simultaneamente (orderId, status e date)', async () => {
      mockedApi.get.mockResolvedValue({ data: [] });

      const testDate = '2026-02-23';
      const filters = {
        orderId: 'ORD-123',
        status: 'pending',
        date: testDate,
      };

      await orderService.getAllOrders(filters);

      const expectedStart = dayjs(testDate).startOf('day').toISOString();
      const expectedEnd = dayjs(testDate).endOf('day').toISOString();

      expect(mockedApi.get).toHaveBeenCalledWith('/orders', {
        params: {
          id: 'ORD-123',
          status: 'pending',
          createdAt_gte: expectedStart,
          createdAt_lte: expectedEnd,
        },
      });
    });

    it('Retorna erro quando a API de ordens falha', async () => {
      mockedApi.get.mockRejectedValue(new Error('Erro ao buscar ordens'));
      await expect(orderService.getAllOrders()).rejects.toThrow(
        'Erro ao buscar ordens',
      );
    });

    it('Deve aplicar filtro de múltiplos status usando o operador :in', async () => {
      mockedApi.get.mockResolvedValue({ data: [] });

      const filters = {
        status: ['Aberta', 'Parcial'],
        side: 'VENDA',
      };

      await orderService.getAllOrders(filters as unknown as OrderFilterData);

      expect(mockedApi.get).toHaveBeenCalledWith('/orders', {
        params: {
          'status:in': 'Aberta,Parcial',
          side: 'VENDA',
        },
      });
    });
  });
});
