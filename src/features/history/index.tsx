import { Header } from '../../components/organism/Header';
import { Sidebar } from '../../components/organism/Sidebar';
import Box from '@mui/material/Box';
import { ContainerCenter } from '../../components/templates/ContainerCenter';
import { HistoryTitle } from './HistoryTitle';
import { HistoryTable } from './HistoryTable';
import { HistoryFilter } from './HistoryFilter';
import { useHistoryStore } from '../../store/useHistoryStore';
import { useHistoryFilters } from '../../store/useHistoryFilter';
import { useEffect, useRef } from 'react';

export const HistoryPage = () => {
  const ordersHistory = useHistoryStore((state) => state.ordersHistory);
  const filters = useHistoryFilters((state) => state.filters);
  const getHistory = useHistoryStore((state) => state.getHistory);

  const lastFiltersRef = useRef(filters);

  useEffect(() => {
    const filtersChanged =
      JSON.stringify(lastFiltersRef.current) !== JSON.stringify(filters);

    if (filtersChanged) {
      lastFiltersRef.current = filters;

      getHistory();
    }
  }, [filters, getHistory]);

  return (
    <Box display={'flex'}>
      <Sidebar />
      <Box width={'100%'} overflow={'hidden'}>
        <Header />
        <ContainerCenter>
          <HistoryTitle />
          <HistoryFilter />
          <HistoryTable data={ordersHistory} />
        </ContainerCenter>
      </Box>
    </Box>
  );
};
