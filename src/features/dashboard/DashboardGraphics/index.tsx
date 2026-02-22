import { Divider, Grid, Paper, Typography } from '@mui/material';
import { ChartBarPortfolio } from './ChartBarPortfolio';
import { ChartDonutPortfolio } from './ChartDonutPortfolio';

export const DashboardGraphics = () => {
  return (
    <Grid container spacing={3} width="100%">
      <Grid size={{ xs: 12, lg: 8 }}>
        <Paper
          sx={{
            p: '24px',
            backgroundColor: 'white',
            border: '1px solid #00000016',
            boxShadow: 'none',
          }}
        >
          <Typography variant="body1" fontWeight={600} pb={2}>
            Evolucao do Patrimônio
          </Typography>
          <Divider />
          <ChartBarPortfolio />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper
          sx={{
            p: '24px',
            backgroundColor: 'white',
            border: '1px solid #00000016',
            boxShadow: 'none',
            height: '100%',
          }}
        >
          <Typography variant="body1" fontWeight={600} pb={2}>
            Composição do Portfólio
          </Typography>
          <Divider />
          <ChartDonutPortfolio />
        </Paper>
      </Grid>
    </Grid>
  );
};
