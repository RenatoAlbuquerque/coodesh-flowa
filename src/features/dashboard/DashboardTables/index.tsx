import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { TableLastOrders } from './TableLastOrders';
import { TableLastSellingOpen } from './TableLastSellingOpen';

export const DashboardTables = () => {
  return (
    <Grid container spacing={3} width="100%" pb="30px">
      <Grid size={{ xs: 12, lg: 8 }}>
        <Paper
          sx={{
            px: '24px',
            pt: '24px',
            backgroundColor: 'white',
            border: '1px solid #00000016',
            boxShadow: 'none',
          }}
        >
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            pb="16px"
          >
            <Typography variant="body1" fontWeight={600}>
              Últimos Ativos colocados a venda
            </Typography>
          </Box>
          <Divider />
          <TableLastSellingOpen />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper
          sx={{
            px: '24px',
            pt: '24px',
            backgroundColor: 'white',
            border: '1px solid #00000016',
            boxShadow: 'none',
          }}
        >
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            pb="16px"
          >
            <Typography variant="body1" fontWeight={600}>
              Últimas Ordens
            </Typography>
            <Button
              variant="outlined"
              size="small"
              color="inherit"
              component={Link}
              to="/orders"
            >
              <Typography
                textTransform={'capitalize'}
                fontSize={'body1'}
                color="#5E616A"
              >
                Ver Todas
              </Typography>
            </Button>
          </Box>
          <Divider />
          <TableLastOrders />
        </Paper>
      </Grid>
    </Grid>
  );
};
