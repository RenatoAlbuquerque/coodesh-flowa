import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '../../../test/utils/AllTheProviders';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useOrderFilters } from '../../../store/useOrderFilters';
import { OrderFilter } from '.';

vi.mock('../../../routes/orders', () => ({
  Route: {
    useLoaderData: () => ({
      assets: [
        { symbol: 'PETR4', name: 'Petrobras' },
        { symbol: 'VALE3', name: 'Vale' },
      ],
    }),
  },
}));

describe('Renderização do filtro de Ordens e integração com a store', () => {
  beforeEach(() => {
    useOrderFilters.getState().resetFilters();
    vi.clearAllMocks();
  });

  it('Desabilitar o botão Filtrar se nenhum campo for alterado', () => {
    render(<OrderFilter />);
    const btnFiltrar = screen.getByRole('button', { name: /filtrar/i });
    expect(btnFiltrar).toBeDisabled();
  });

  it('Habilitar o botão Filtrar e atualizar o store ao preencher o ID', async () => {
    render(<OrderFilter />);

    const inputId = screen.getByPlaceholderText('EX: ORD-123');
    fireEvent.change(inputId, { target: { value: 'ORD-TEST-123' } });

    const btnFiltrar = screen.getByRole('button', { name: /filtrar/i });
    expect(btnFiltrar).not.toBeDisabled();

    fireEvent.click(btnFiltrar);

    await waitFor(() => {
      const state = useOrderFilters.getState().filters;
      expect(state.orderId).toBe('ORD-TEST-123');
    });
  });

  it('Resetar o formulário e o store ao clicar em Limpar', async () => {
    useOrderFilters.getState().setFilters({
      orderId: 'FILTRO-ATIVO',
      instrument: 'PETR4',
      side: 'COMPRA',
      status: 'Aberta',
      date: null,
    });

    render(<OrderFilter />);

    const btnLimpar = screen.getByRole('button', { name: /limpar/i });

    expect(btnLimpar).not.toBeDisabled();

    fireEvent.click(btnLimpar);

    await waitFor(() => {
      const state = useOrderFilters.getState().filters;
      expect(state.orderId).toBe('');
      expect(state.instrument).toBeNull();
    });
  });

  it('Validar a seleção do Autocomplete de Lado (Compra/Venda)', async () => {
    render(<OrderFilter />);

    const autocomplete = screen.getByPlaceholderText('Compra / Venda');
    fireEvent.mouseDown(autocomplete);

    const option = await screen.findByText('COMPRA');
    fireEvent.click(option);

    fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));

    await waitFor(() => {
      expect(useOrderFilters.getState().filters.side).toBe('COMPRA');
    });
  });
});
