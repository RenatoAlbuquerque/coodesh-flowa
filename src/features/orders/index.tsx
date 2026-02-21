import { Header } from '../../components/organism/Header';
import { Sidebar } from '../../components/organism/Sidebar';
import Box from '@mui/material/Box';
import { ContainerCenter } from '../../components/templates/ContainerCenter';
import { OrderTitle } from './OrderTitle';
import { OrderFilter } from './OrderFilter';

export const OrdersPage = () => {
  return (
    <Box display={'flex'}>
      <Sidebar />
      <Box width={'100%'}>
        <Header />
        <ContainerCenter>
          <OrderTitle />
          <OrderFilter />
        </ContainerCenter>
      </Box>
    </Box>
  );
};
