import { Header } from '../../components/organism/Header';
import { Sidebar } from '../../components/organism/Sidebar';
import Box from '@mui/material/Box';
import { ContainerCenter } from '../../components/templates/ContainerCenter';
import { PortfolioTable } from './PortfolioTable';
import { PortfolioTitle } from './PortfolioTitle';
import { PortfolioStats } from './PortfolioStats';
import { PortfolioAllocation } from './PortfolioAllocation';
import { Route } from '../../routes/portfolio';

export const PortfolioPage = () => {
  const { positions } = Route.useLoaderData();

  return (
    <Box display={'flex'}>
      <Sidebar />
      <Box width={'100%'} overflow={'hidden'}>
        <Header />
        <ContainerCenter>
          <PortfolioTitle />
          <PortfolioStats />
          <PortfolioAllocation />
          <PortfolioTable data={positions} />
        </ContainerCenter>
      </Box>
    </Box>
  );
};
