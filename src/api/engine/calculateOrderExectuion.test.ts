import { describe, it, expect } from 'vitest';
import { calculateOrderExecution } from './calculateOrderExecution';
import type { Order } from '../../@types/api';
import type { OrderFormData } from '../../components/molecules/Modals/NewOrderModal/newOrderScheme';

describe('Cálculos de Execução de Ordem com o Matching Engine', () => {
  const createMockOrder = (overrides: Partial<Order>): Order => ({
    id: 'EXISTING',
    instrument: 'PETR4',
    side: 'VENDA',
    status: 'Aberta',
    price: 30,
    remainingQuantity: 100,
    quantity: 100,
    owner: 'Mercado',
    currentPrice: 30,
    createdAt: new Date().toISOString(),
    ...overrides,
  });

  it('Deve retornar a Ordem aberta pois não da Match com o mock do livro', () => {
    const newOrder: OrderFormData = {
      instrument: 'PETR4',
      side: 'COMPRA',
      price: 30,
      quantity: 10,
    };
    const result = calculateOrderExecution(newOrder, []);

    expect(result.hasMatch).toBe(false);
    expect(result.status).toBe('Aberta');
    expect(result.remainingQuantity).toBe(10);
  });

  it('Executar totalmente quando encontrar Ordem com preço menor ou igual ao de compra', () => {
    const newOrder: OrderFormData = {
      instrument: 'PETR4',
      side: 'COMPRA',
      price: 35,
      quantity: 50,
    };
    const orderExisting = [
      createMockOrder({ price: 30, remainingQuantity: 100 }),
    ];

    const result = calculateOrderExecution(newOrder, orderExisting);

    expect(result.hasMatch).toBe(true);
    expect(result.status).toBe('Executada');
    expect(result.remainingQuantity).toBe(0);
    expect(result.counterpartUpdate?.remainingQuantity).toBe(50);
    expect(result.counterpartUpdate?.status).toBe('Parcial');
  });

  it('Priorizar a melhor oferta (menor preço de venda para quem compra)', () => {
    const newOrder: OrderFormData = {
      instrument: 'PETR4',
      side: 'COMPRA',
      price: 40,
      quantity: 10,
    };
    const existing = [
      createMockOrder({ id: 'Order-preco-35', price: 35 }),
      createMockOrder({ id: 'Order-preco-30', price: 30 }),
    ];

    const result = calculateOrderExecution(newOrder, existing);

    expect(result.match?.id).toBe('Order-preco-30');
    expect(result.match?.price).toBe(30);
  });

  it('A ordem deve ficar com status Parcial quando a nova ordem for maior que a contraparte disponível', () => {
    const newOrder: OrderFormData = {
      instrument: 'PETR4',
      side: 'COMPRA',
      price: 30,
      quantity: 150,
    };
    const existing = [createMockOrder({ price: 30, remainingQuantity: 100 })];

    const result = calculateOrderExecution(newOrder, existing);

    expect(result.status).toBe('Parcial');
    expect(result.remainingQuantity).toBe(50);
    expect(result?.counterpartUpdate?.status).toBe('Executada');
    expect(result?.counterpartUpdate?.remainingQuantity).toBe(0);
  });

  it('Não deve fazer match se o preço de compra for menor que o de venda e deve mater o Status da Ordem Aberta', () => {
    const newOrder: OrderFormData = {
      instrument: 'PETR4',
      side: 'COMPRA',
      price: 29.99,
      quantity: 100,
    };
    const existing = [createMockOrder({ price: 30 })];

    const result = calculateOrderExecution(newOrder, existing);

    expect(result.hasMatch).toBe(false);
    expect(result.status).toBe('Aberta');
  });
});
