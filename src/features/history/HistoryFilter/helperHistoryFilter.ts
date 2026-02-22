import dayjs from 'dayjs';
import { z } from 'zod';

export const historyFilterSchema = z
  .object({
    orderId: z.string().optional(),
    instrument: z.string().nullable().optional(),
    eventType: z.string().nullable().optional(),
    startDate: z.any().nullable().optional(),
    endDate: z.any().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return (
          dayjs(data.endDate).isAfter(dayjs(data.startDate)) ||
          dayjs(data.endDate).isSame(dayjs(data.startDate))
        );
      }
      return true;
    },
    {
      message: 'A data final deve ser posterior à data inicial',
      path: ['endDate'],
    },
  );
export type HistoryFilterData = z.infer<typeof historyFilterSchema>;
