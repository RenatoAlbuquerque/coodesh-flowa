import { DataTable } from '../../../components/molecules/DataTable';
import { useMemo } from 'react';
import { orderColumns } from './orderColumns';
import { useOrderFilters } from '../../../store/useOrderFilters';
import { applyOrderFilters } from '../../../actions/orders';
import type { Order } from '../../../@types/api';

export const OrderTable = ({ data }: { data: Order[] }) => {
  const filters = useOrderFilters((state) => state.filters);

  const filteredOrders = useMemo(() => {
    return applyOrderFilters(data, filters);
  }, [data, filters]);

  return <DataTable rows={filteredOrders} columns={orderColumns} />;
};
