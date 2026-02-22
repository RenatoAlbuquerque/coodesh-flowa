import dayjs from 'dayjs';
import type { Order } from '../@types/api';
import type { OrderFilterData } from '../features/orders/OrderFilter/helperOrderFilter';

export const applyOrderFilters = (
  data: Order[],
  filters: OrderFilterData,
): Order[] => {
  return data.filter((order) => {
    const matchesId = filters.orderId
      ? order.id
          .toString()
          .toLowerCase()
          .includes(filters.orderId.replace('#', '').toLowerCase())
      : true;

    const matchesInstrument = filters.instrument
      ? order.instrument === filters.instrument
      : true;

    const matchesSide = filters.side ? order.side === filters.side : true;

    const matchesStatus = filters.status
      ? order.status === filters.status
      : true;

    const matchesDate = filters.date
      ? dayjs(order.createdAt).isSame(dayjs(filters.date), 'day')
      : true;

    return (
      matchesId &&
      matchesInstrument &&
      matchesSide &&
      matchesStatus &&
      matchesDate
    );
  });
};
