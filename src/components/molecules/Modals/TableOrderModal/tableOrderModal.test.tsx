import {
  render,
  screen,
  fireEvent,
} from '../../../../test/utils/AllTheProviders';
import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';
import {
  useOrderStore,
  type OrderState,
} from '../../../../store/useOrderStore';
import type { Order, OrderStatus } from '../../../../@types/api';
import { TableOrderModal } from '.';

vi.mock('../../../../store/useOrderStore', () => ({
  useOrderStore: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    promise: vi.fn((p) => p),
  },
}));

const mockCancelOrder = vi.fn();

const orderAberta: Order = {
  id: 'ORD-123',
  instrument: 'PETR4',
  category: 'Ações',
  side: 'COMPRA',
  status: 'Aberta',
  price: 30,
  quantity: 100,
  remainingQuantity: 100,
  owner: 'Renato Abreu',
  currentPrice: 30,
  createdAt: new Date().toISOString(),
};

describe('Componente TableOrderModal', () => {
  const useOrderStoreMock = useOrderStore as unknown as Mock;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    useOrderStoreMock.mockImplementation(
      (selector: (state: Partial<OrderState>) => unknown) =>
        selector({
          cancelOrder: mockCancelOrder,
        }),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Habilita o botão de cancelamento para ordens Abertas', () => {
    render(<TableOrderModal order={orderAberta} />);
    const cancelBtn = screen.getByLabelText('Cancelar Ordem');
    expect(cancelBtn).not.toBeDisabled();
  });

  it('deve desabilitar o botão de cancelamento para ordens Executadas', () => {
    const orderExecutada = {
      ...orderAberta,
      status: 'Executada' as OrderStatus,
    };
    render(<TableOrderModal order={orderExecutada} />);
    const cancelBtn = screen.getByTestId('button-cancel-order');
    expect(cancelBtn).toBeDisabled();
  });

  it('Abre o modal de confirmação ao clicar no ícone de cancelar', () => {
    render(<TableOrderModal order={orderAberta} />);
    const cancelBtn = screen.getByTestId('button-cancel-order');
    fireEvent.click(cancelBtn);

    expect(screen.getByText(/Cancelar Ordem/i)).toBeInTheDocument();
    expect(screen.getByText(/#ORD-123/i)).toBeInTheDocument();
  });

  it('Fecha o modal de cancelamento ao clicar em Voltar', () => {
    render(<TableOrderModal order={orderAberta} />);
    const cancelBtn = screen.getByTestId('button-cancel-order');
    fireEvent.click(cancelBtn);

    const returnBtn = screen.getByTestId('button-return-modal');
    fireEvent.click(returnBtn);

    expect(
      screen.queryByText(/confira os detalhes da operação/i),
    ).not.toBeVisible();
  });

  it('Executa o fluxo de cancelamento com sucesso (sucesso na Action)', async () => {
    render(<TableOrderModal order={orderAberta} />);

    const openBtn = screen.getByTestId('button-cancel-order');
    fireEvent.click(openBtn);

    const confirmBtn = screen.getByTestId('button-confirm-cancel-order');
    fireEvent.click(confirmBtn);

    expect(confirmBtn).toBeDisabled();
    expect(screen.getByText('Cancelando...')).toBeInTheDocument();
  });
});
