import { z } from 'zod';

export const orderFilterSchema = z
  .object({
    orderId: z.string().optional(),
    instrument: z.string().nullable().optional(),
    side: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    date: z.any().nullable().optional(),
    _page: z.number().nullable().optional(),
    _per_page: z.number().nullable().optional(),
  })
  .refine(
    (data) => {
      return Object.values(data).some(
        (value) => value !== '' && value !== null && value !== undefined,
      );
    },
    {
      message: 'Preencha pelo menos um campo para filtrar',
      path: ['orderId'],
    },
  );

export type OrderFilterData = z.infer<typeof orderFilterSchema>;
