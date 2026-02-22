import { DataTable } from '../../../components/molecules/DataTable';
import { portfolioColumns } from './portfolioColumns';
import type { IPortfolioResponse } from '../../../@types/portfolio';

export const PortfolioTable = ({ data }: { data: IPortfolioResponse[] }) => {
  return (
    <DataTable
      rows={data as unknown as Record<string, unknown>[]}
      columns={portfolioColumns}
      rowCount={data?.length || 0}
      pageSize={10}
    />
  );
};
