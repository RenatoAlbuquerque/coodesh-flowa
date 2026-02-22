import { DataTable } from '../../../components/molecules/DataTable';
import { orderColumns } from './orderColumns';
import type { Order } from '../../../@types/api';

export const OrderTable = ({ data }: { data: Order[] }) => {
  return (
    <DataTable
      rows={data as unknown as Record<string, unknown>[]}
      columns={orderColumns}
    />
  );
};
