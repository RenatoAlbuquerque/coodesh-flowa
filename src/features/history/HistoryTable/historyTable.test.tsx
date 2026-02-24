import { render, screen } from '../../../test/utils/AllTheProviders';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useHistoryFilters } from '../../../store/useHistoryFilter';
import type { IResponseHistory } from '../../../@types/api';
import { HistoryTable } from '.';

const mockData: IResponseHistory = {
  data: [
    {
      id: '1',
      orderId: 'ORD-123',
      instrument: 'PETR4',
      eventType: 'Execução Total',
      details: 'Compra realizada',
      origin: 'Sistema de Matching',
      timestamp: '2026-02-23T15:30:00.000Z',
    },
    {
      id: '2',
      orderId: 'ORD-456',
      instrument: 'VALE3',
      eventType: 'Cancelamento',
      details: 'Cancelado pelo usuário',
      origin: 'Renato Abreu',
      timestamp: '2026-02-23T16:00:00.000Z',
    },
  ],
  items: 2,
  pages: 1,
  first: 1,
  last: 1,
  next: 0,
};

describe('Renderização dos itens da tabela de histórico de eventos', () => {
  beforeEach(() => {
    useHistoryFilters.getState().resetFilters();
    vi.clearAllMocks();
  });

  it('Renderizar as linhas de histórico corretamente', () => {
    render(<HistoryTable data={mockData} />);

    expect(screen.getByText('PETR4')).toBeInTheDocument();
    expect(screen.getByText('VALE3')).toBeInTheDocument();

    expect(screen.getByText('#ORD-123')).toBeInTheDocument();
    expect(screen.getByText('#ORD-456')).toBeInTheDocument();
  });

  it('Renderizar o ícone de robô para origem de Ordens do "Sistema"', () => {
    render(<HistoryTable data={mockData} />);

    const systemIcon = screen.getByTestId('SmartToyOutlinedIcon');
    expect(systemIcon).toBeInTheDocument();
  });

  it('Renderiza o Avatar para origem manual', () => {
    render(<HistoryTable data={mockData} />);

    expect(screen.getByText('RA')).toBeInTheDocument();
  });
});
