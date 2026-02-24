import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useOrderStore } from './useOrderStore';
import { orderService } from '../services/orderService';
import { assetsService } from '../services/assetsService';
import { dashboardService } from '../services/dashboardService';
import { api } from '../services/axios';
import { toast } from 'react-toastify';
import { createOrderAction } from '../actions/createOrderAction';
import { cancelOrderAction } from '../actions/cancelOrderAction';
import type {
  AvailableAsset,
  DashboardStats,
  IResponseOrders,
  Order,
} from '../@types/api';

vi.mock('../services/orderService');
vi.mock('../services/assetsService');
vi.mock('../services/dashboardService');
vi.mock('../services/axios');
vi.mock('../actions/createOrderAction');
vi.mock('../actions/cancelOrderAction');
vi.mock('react-toastify', () => ({ toast: { error: vi.fn() } }));

const mockedOrderService = vi.mocked(orderService);
const mockedAssetsService = vi.mocked(assetsService);
const mockedDashboardService = vi.mocked(dashboardService);
const mockedApi = vi.mocked(api);

describe('Testes da useOrderStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useOrderStore.setState({
      orders: { data: [], items: 0, first: 0, last: 0, next: 0, pages: 0 },
      availableAssets: [],
      isLoading: false,
      error: null,
      stats: {
        evolucao_patrimonial: [],
        patrimonio_total: 0,
        rentabilidade_mes: 0,
        saldo_disponivel: 0,
        valor_investido: 0,
        variacao_diaria_percent: 0,
      },
    });
  });

  it('Teste do estado inicial', () => {
    const state = useOrderStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.orders.data).toEqual([]);
  });

  describe('getOrders', () => {
    it('Formata corretamente quando a API retorna um array simples', async () => {
      const mockArray = [{ id: '1' }] as Order[];
      mockedOrderService.getAllOrders.mockResolvedValue(mockArray);

      await useOrderStore.getState().getOrders();

      const state = useOrderStore.getState();
      expect(state.orders.data).toEqual(mockArray);
      expect(state.orders.items).toBe(1);
      expect(state.isLoading).toBe(false);
    });

    it('Salva os dados diretamente quando a API retorna um objeto paginado', async () => {
      const mockPaginated = {
        data: [{ id: '1' }],
        items: 10,
      } as IResponseOrders;
      mockedOrderService.getAllOrders.mockResolvedValue(mockPaginated);

      await useOrderStore.getState().getOrders();

      expect(useOrderStore.getState().orders).toEqual(mockPaginated);
    });

    it('Trata erros e atualiza o estado de erro', async () => {
      mockedOrderService.getAllOrders.mockRejectedValue(
        new Error('Falha na API'),
      );

      await useOrderStore.getState().getOrders();

      const state = useOrderStore.getState();
      expect(state.error).toBe('Falha na API');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('getAvailableAssets', () => {
    it('Carrega ativos com sucesso', async () => {
      const mockAssets = [{ id: '1', symbol: 'PETR4' }] as AvailableAsset[];
      mockedAssetsService.availableAssets.mockResolvedValue(mockAssets);

      await useOrderStore.getState().getAvailableAssets();

      expect(useOrderStore.getState().availableAssets).toEqual(mockAssets);
    });

    it('Dispara toast em caso de erro', async () => {
      mockedAssetsService.availableAssets.mockRejectedValue(new Error());

      await useOrderStore.getState().getAvailableAssets();

      expect(toast.error).toHaveBeenCalledWith(
        'Erro ao buscar ativos disponíveis:',
      );
    });
  });

  describe('updateDashboardBalance', () => {
    const initialStats = {
      saldo_disponivel: 1000,
      valor_investido: 500,
    };

    it('Subtrai do saldo e soma ao investido ao realizar COMPRA', async () => {
      mockedDashboardService.getDashboardStats.mockResolvedValue(
        initialStats as DashboardStats,
      );

      await useOrderStore.getState().updateDashboardBalance(200, 'COMPRA');

      expect(mockedApi.patch).toHaveBeenCalledWith('/dashboard_stats', {
        saldo_disponivel: 800,
        valor_investido: 700,
        patrimonio_total: 1500,
      });

      expect(useOrderStore.getState().stats.saldo_disponivel).toBe(800);
    });

    it('deve somar no saldo e subtrair do investido ao realizar VENDA ou CANCELAMENTO', async () => {
      mockedDashboardService.getDashboardStats.mockResolvedValue(
        initialStats as DashboardStats,
      );

      await useOrderStore.getState().updateDashboardBalance(100, 'VENDA');

      expect(mockedApi.patch).toHaveBeenCalledWith('/dashboard_stats', {
        saldo_disponivel: 1100,
        valor_investido: 400,
        patrimonio_total: 1500,
      });
    });

    it('Envia erro ao console se o patch falhar', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockedDashboardService.getDashboardStats.mockRejectedValue(
        new Error('Erro DB'),
      );

      await useOrderStore.getState().updateDashboardBalance(100, 'COMPRA');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao atualizar dashboard:',
        expect.any(Error),
      );
    });
  });

  describe('Actions', () => {
    it('Executa createOrderAction com os parâmetros corretos', async () => {
      const formData = { instrument: 'PETR4' } as Order;
      await useOrderStore.getState().createOrder(formData);

      expect(createOrderAction).toHaveBeenCalledWith(
        formData,
        expect.any(Function),
        expect.any(Function),
      );
    });

    it('deve chamar cancelOrderAction com os parâmetros corretos', async () => {
      const order = { id: 'ORD1' } as Order;
      await useOrderStore.getState().cancelOrder(order);

      expect(cancelOrderAction).toHaveBeenCalledWith(
        order,
        expect.any(Function),
        expect.any(Function),
      );
    });
  });
});
