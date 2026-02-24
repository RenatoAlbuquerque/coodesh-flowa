import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createOrderAction } from '../actions/createOrderAction';
import { toast } from 'react-toastify';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';
import type { Order, OrderSide } from '../@types/api';
import type { OrderState } from '../store/useOrderStore';

vi.mock('react-toastify', () => ({ toast: { info: vi.fn(), error: vi.fn() } }));

describe('Criação de ordem e utilização do Matching Engine', () => {
  const mockUpdateBalance = vi.fn();
  const mockSet = vi.fn();
  const mockGet = vi.fn(() => ({
    updateDashboardBalance: mockUpdateBalance,
  }));

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  it('Executar uma ordem COMPLETA quando encontrar uma contraparte idêntica', async () => {
    const newOrderForm = {
      instrument: 'PETR4',
      side: 'COMPRA' as OrderSide,
      price: 30,
      quantity: 100,
      owner: 'Renato Abreu',
    };

    const promise = createOrderAction(
      newOrderForm as Order,
      mockGet as unknown as () => OrderState,
      mockSet,
    );

    await vi.runAllTimersAsync();
    await promise;

    expect(mockUpdateBalance).toHaveBeenCalledWith(3000, 'COMPRA');

    expect(toast.info).toHaveBeenCalledWith(
      expect.stringContaining('Match instantâneo em PETR4!'),
    );

    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({ isLoading: false }),
    );
  });

  it('Criar uma ordem com status ABERTA quando não houver preço compatível', async () => {
    server.use(http.get('*/orders', () => HttpResponse.json([])));

    const newOrderForm = {
      instrument: 'VALE3',
      side: 'COMPRA' as OrderSide,
      price: 50,
      quantity: 10,
      owner: 'Renato Abreu',
    };

    const promise = createOrderAction(
      newOrderForm as Order,
      mockGet as unknown as () => OrderState,
      mockSet,
    );
    await vi.runAllTimersAsync();
    await promise;

    expect(toast.info).not.toHaveBeenCalled();
    expect(mockUpdateBalance).toHaveBeenCalledWith(500, 'COMPRA');
  });
});
