import { Header } from '../../components/organism/Header';
import { Sidebar } from '../../components/organism/Sidebar';
import Box from '@mui/material/Box';
import { ContainerCenter } from '../../components/templates/ContainerCenter';
import { OrderTitle } from './OrderTitle';
import { OrderFilter } from './OrderFilter';
import { OrderTable } from './OrderTable';
import { useOrderFilters } from '../../store/useOrderFilters';
import dayjs from 'dayjs';
import { useOrderStore } from '../../store/useOrderStore';

export const OrdersPage = () => {
  const orders = useOrderStore((state) => state.orders);
  const filters = useOrderFilters((state) => state.filters);

  const filteredOrders = orders?.filter((order) => {
    const matchId =
      !filters.orderId ||
      order.id.toLowerCase().includes(filters.orderId.toLowerCase());
    const matchInstrument =
      !filters.instrument || order.instrument === filters.instrument;
    const matchSide = !filters.side || order.side === filters.side;
    const matchStatus = !filters.status || order.status === filters.status;
    const matchDate =
      !filters.date ||
      dayjs(order.createdAt).isSame(dayjs(filters.date), 'day');

    return matchId && matchInstrument && matchSide && matchStatus && matchDate;
  });

  return (
    <Box display={'flex'}>
      <Sidebar />
      <Box width={'100%'} overflow={'hidden'}>
        <Header />
        <ContainerCenter>
          <OrderTitle />
          <OrderFilter />
          <OrderTable data={filteredOrders} />
        </ContainerCenter>
      </Box>
    </Box>
  );
};
