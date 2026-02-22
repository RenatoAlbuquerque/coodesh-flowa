import { Header } from '../../components/organism/Header';
import { Sidebar } from '../../components/organism/Sidebar';
import Box from '@mui/material/Box';
import { ContainerCenter } from '../../components/templates/ContainerCenter';
import { DashboardTitle } from './DashboardTitle';
import { DashboardStats } from './DashboardStats';
import { DashboardGraphics } from './DashboardGraphics';

export const DashboardPage = () => {
  return (
    <Box display={'flex'}>
      <Sidebar />
      <Box width={'100%'} overflow={'hidden'}>
        <Header />
        <ContainerCenter>
          <DashboardTitle />
          <DashboardStats />
          <DashboardGraphics />
        </ContainerCenter>
      </Box>
    </Box>
  );
};
