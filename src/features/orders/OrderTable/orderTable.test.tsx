import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '../../../test/utils/AllTheProviders';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useOrderFilters } from '../../../store/useOrderFilters';
import { historyService } from '../../../services/historyService';
import { toast } from 'react-toastify';
import { OrderTable } from '.';
import type { IResponseOrders, OrderHistory, Order } from '../../../@types/api';

vi.mock('../../../services/historyService', () => ({
  historyService: {
    getAllHistory: vi.fn(),
  },
}));

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn() },
}));

const getAllHistoryMock = vi.mocked(historyService.getAllHistory);

const mockOrders: IResponseOrders = {
  data: [
    {
      id: 'ORD-1',
      instrument: 'PETR4',
      side: 'COMPRA',
      price: 35,
      quantity: 100,
      remainingQuantity: 0,
      status: 'Executada',
      createdAt: '2026-02-23T10:00:00Z',
      owner: 'Renato Abreu',
      currentPrice: 35,
    },
    {
      id: 'ORD-2',
      instrument: 'VALE3',
      side: 'VENDA',
      price: 90,
      quantity: 50,
      remainingQuantity: 50,
      status: 'Aberta',
      createdAt: '2026-02-23T11:00:00Z',
      owner: 'Renato Abreu',
      currentPrice: 90,
    },
  ] as Order[],
  items: 2,
  pages: 1,
  first: 1,
  last: 1,
  next: 0,
};

describe('Renderização da tabela de Ordens', () => {
  beforeEach(() => {
    vi.useRealTimers();
    useOrderFilters.getState().resetFilters();
    vi.clearAllMocks();
  });

  it('Renderiza as ordens com informações corretas', () => {
    render(<OrderTable data={mockOrders} />);

    expect(screen.getByText('PETR4')).toBeInTheDocument();
    expect(screen.getByText('VALE3')).toBeInTheDocument();
    expect(screen.getByText('Executada')).toBeInTheDocument();
    expect(screen.getByText('Aberta')).toBeInTheDocument();
  });

  it('Abre o modal de linha do tempo ao clicar em uma linha', async () => {
    const mockHistory = [
      {
        id: 'h1',
        orderId: 'ORD-1',
        instrument: 'PETR4',
        eventType: 'Ordem Criada',
        timestamp: new Date().toISOString(),
        details: 'Texto de Sucesso do Modal',
        origin: 'Sistema',
      },
    ];

    getAllHistoryMock.mockResolvedValue(mockHistory as OrderHistory[]);

    render(<OrderTable data={mockOrders} />);

    const cell = screen.getByRole('gridcell', { name: /PETR4/i });
    fireEvent.click(cell);

    const modalText = await screen.findByText(/Texto de Sucesso do Modal/i);

    expect(modalText).toBeInTheDocument();
    expect(screen.getByText(/Histórico da Ordem ORD-1/i)).toBeInTheDocument();
  });

  it('Exibe erro se a busca pelo histórico falhar', async () => {
    getAllHistoryMock.mockRejectedValue(new Error('Erro API'));

    render(<OrderTable data={mockOrders} />);

    const cell = screen.getByText('VALE3');
    fireEvent.click(cell);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Erro ao carregar linha do tempo',
      );
    });
  });
});
