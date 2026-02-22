import { DataTable } from '../../../components/molecules/DataTable';
import { historyColumns } from './historyColumns';
import type { OrderHistory } from '../../../@types/api';

export const HistoryTable = ({ data }: { data: OrderHistory[] }) => {
  return (
    <DataTable
      rows={data as unknown as Record<string, unknown>[]}
      columns={historyColumns}
    />
  );
};
