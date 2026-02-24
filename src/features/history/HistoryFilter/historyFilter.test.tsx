import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '../../../test/utils/AllTheProviders';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useHistoryFilters } from '../../../store/useHistoryFilter';
import { HistoryFilter } from '.';

vi.mock('../../../routes/history', () => ({
  Route: {
    useLoaderData: () => ({
      assets: [
        { symbol: 'PETR4', name: 'Petrobras' },
        { symbol: 'VALE3', name: 'Vale' },
      ],
    }),
  },
}));

describe('Integração do filtro de Histórico de Eventos e integração com a Store', () => {
  beforeEach(() => {
    useHistoryFilters.getState().resetFilters();
    vi.clearAllMocks();
  });

  it('Inicia com o botão Filtrar desabilitado (isDirty)', () => {
    render(<HistoryFilter />);
    const btnFiltrar = screen.getByRole('button', { name: /filtrar/i });
    expect(btnFiltrar).toBeDisabled();
  });

  it('Atualizar a store do Zustand ao preencher e filtrar', async () => {
    render(<HistoryFilter />);

    const inputId = screen.getByPlaceholderText('EX: ORD-123');
    fireEvent.change(inputId, { target: { value: 'ORD-999' } });

    const btnFiltrar = screen.getByRole('button', { name: /filtrar/i });
    expect(btnFiltrar).not.toBeDisabled();

    fireEvent.click(btnFiltrar);

    await waitFor(() => {
      const state = useHistoryFilters.getState().filters;
      expect(state.orderId).toBe('ORD-999');
    });
  });

  it('Reseta os filtros ao clicar no botão Limpar', async () => {
    useHistoryFilters.getState().setFilters({
      orderId: 'ORD-PROVISORIA',
      instrument: 'PETR4',
      eventType: 'Execução Total',
      startDate: null,
      endDate: null,
    });

    render(<HistoryFilter />);

    const btnLimpar = screen.getByRole('button', { name: /limpar/i });
    fireEvent.click(btnLimpar);

    await waitFor(() => {
      const state = useHistoryFilters.getState().filters;
      expect(state.orderId).toBe('');
      expect(state.instrument).toBeNull();
    });
  });

  it('Interação com o Autocomplete de instrumentos para pesquisa', async () => {
    render(<HistoryFilter />);

    const autocomplete = screen.getByPlaceholderText('Todos os ativos');
    fireEvent.mouseDown(autocomplete);

    const option = await screen.findByText('PETR4');
    fireEvent.click(option);

    const btnFiltrar = screen.getByRole('button', { name: /filtrar/i });
    fireEvent.click(btnFiltrar);

    await waitFor(() => {
      const state = useHistoryFilters.getState().filters;
      expect(state.instrument).toBe('PETR4');
    });
  });
});
