import { Header } from '../../components/organism/Header';
import { Sidebar } from '../../components/organism/Sidebar';
import Box from '@mui/material/Box';
import { ContainerCenter } from '../../components/templates/ContainerCenter';
import { HistoryTitle } from './HistoryTitle';
import { HistoryTable } from './HistoryTable';
import { HistoryFilter } from './HistoryFilter';
import { useHistoryStore } from '../../store/useHistoryStore';

export const HistoryPage = () => {
  const ordersHistory = useHistoryStore((state) => state.ordersHistory);

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
