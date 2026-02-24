import { describe, it, expect } from 'vitest';
import { orderFilterSchema } from './helperOrderFilter';

describe('Validação do schema do  filtros de ordens', () => {
  it('Falha se todos os campos estiverem vazios', () => {
    const emptyData = {
      orderId: '',
      instrument: null,
      side: null,
      status: null,
      date: null,
    };

    const result = orderFilterSchema.safeParse(emptyData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Preencha pelo menos um campo para filtrar',
      );
    }
  });

  it('Passa se pelo menos um campo estiver preenchido', () => {
    const validData = { orderId: 'ORD-123' };
    const result = orderFilterSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
