// src/features/history/HistoryFilter/helperHistoryFilter.test.ts
import { describe, it, expect } from 'vitest';
import { historyFilterSchema } from './helperHistoryFilter';

describe('Validação do historyFilterSchema', () => {
  it('Falhar se a data final for anterior à data inicial', () => {
    const invalidData = {
      startDate: new Date('2026-02-20'),
      endDate: new Date('2026-02-10'),
    };

    const result = historyFilterSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'A data final deve ser posterior à data inicial',
      );
    }
  });

  it('Passar se as datas forem iguais ou a final for posterior á inicial', () => {
    const validData = {
      startDate: new Date('2026-02-20'),
      endDate: new Date('2026-02-20'),
    };
    expect(historyFilterSchema.safeParse(validData).success).toBe(true);
  });
});
