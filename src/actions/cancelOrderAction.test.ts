import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cancelOrderAction } from '../actions/cancelOrderAction';
import type { Order } from '../@types/api';
import type { OrderState } from '../store/useOrderStore';

describe('Cancelamento de ordem e estorno', () => {
  const mockUpdateBalance = vi.fn();
  const mockSet = vi.fn();
  const mockGet = vi.fn(() => ({
    updateDashboardBalance: mockUpdateBalance,
  }));

  const orderAberta = {
    id: 'ORD-123',
    instrument: 'PETR4',
    side: 'COMPRA',
    status: 'Aberta',
    price: 30,
    remainingQuantity: 100,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Cancelar uma ordem de COMPRA e estornar o valor correto para o saldo', async () => {
    const promise = cancelOrderAction(
      orderAberta as Order,
      mockGet as unknown as () => OrderState,
      mockSet,
    );

    await vi.runAllTimersAsync();
    await promise;

    expect(mockUpdateBalance).toHaveBeenCalledWith(3000, 'CANCELAMENTO_COMPRA');

    expect(mockSet).toHaveBeenCalledWith({ isLoading: true });
    expect(mockSet).toHaveBeenLastCalledWith(
      expect.objectContaining({ isLoading: false }),
    );
  });

  it('Não deve permitir o cancelamento de uma ordem já EXECUTADA', async () => {
    const orderExecutada = { ...orderAberta, status: 'Executada' };

    const promise = cancelOrderAction(
      orderExecutada as Order,
      mockGet as unknown as () => OrderState,
      mockSet,
    );

    vi.advanceTimersByTime(1000);

    await promise;

    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Apenas ordens abertas ou parciais podem ser canceladas.',
      }),
    );

    expect(mockUpdateBalance).not.toHaveBeenCalled();
  });
});
