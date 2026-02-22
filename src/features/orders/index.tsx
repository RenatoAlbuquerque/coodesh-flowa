import { Header } from '../../components/organism/Header';
import { Sidebar } from '../../components/organism/Sidebar';
import Box from '@mui/material/Box';
import { ContainerCenter } from '../../components/templates/ContainerCenter';
import { OrderTitle } from './OrderTitle';
import { OrderFilter } from './OrderFilter';
import { OrderTable } from './OrderTable';
import { useOrderStore } from '../../store/useOrderStore';
import { useOrderFilters } from '../../store/useOrderFilters';
import { useEffect, useRef } from 'react';

export const OrdersPage = () => {
  const orders = useOrderStore((state) => state.orders);
  const filters = useOrderFilters((state) => state.filters);
  const getOrders = useOrderStore((state) => state.getOrders);

  const lastFiltersRef = useRef(filters);

  useEffect(() => {
    const filtersChanged =
      JSON.stringify(lastFiltersRef.current) !== JSON.stringify(filters);

    if (filtersChanged) {
      lastFiltersRef.current = filters;

      getOrders();
    }
  }, [filters, getOrders]);

  return (
    <Box display={'flex'}>
      <Sidebar />
      <Box width={'100%'} overflow={'hidden'}>
        <Header />
        <ContainerCenter>
          <OrderTitle />
          <OrderFilter />
          <OrderTable data={orders} />
        </ContainerCenter>
      </Box>
    </Box>
  );
};
