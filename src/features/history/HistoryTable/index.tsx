import { DataTable } from '../../../components/molecules/DataTable';
import { historyColumns } from './historyColumns';
import type { IResponseHistory } from '../../../@types/api';
import { useHistoryFilters } from '../../../store/useHistoryFilter';

export const HistoryTable = ({ data }: { data: IResponseHistory }) => {
  const historyFilters = useHistoryFilters((state) => state.filters);
  const setPagination = useHistoryFilters((state) => state.setPagination);

  return (
    <DataTable
      rows={data.data as unknown as Record<string, unknown>[]}
      columns={historyColumns}
      rowCount={data?.items || 0}
      page={(historyFilters._page || 1) - 1}
      pageSize={historyFilters._per_page || 5}
      onPaginationModelChange={(model) => {
        if (
          model.page + 1 !== historyFilters._page ||
          model.pageSize !== historyFilters._per_page
        ) {
          setPagination(model.page + 1, model.pageSize);
        }
      }}
    />
  );
};
