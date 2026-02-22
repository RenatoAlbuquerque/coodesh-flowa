import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { useTheme } from '@mui/material';

export const PortfolioTitle = () => {
  const {
    palette: { common },
  } = useTheme();
  return (
    <Box
      display={'flex'}
      py="32px"
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <Box>
        <Typography variant="h1" fontWeight={700} pb="6px">
          Meu Portfólio
        </Typography>
        <Typography variant="h2" fontWeight={400} color="text.disabled">
          Acompanhe a alocação dos seus ativos, saldo disponível e performance
          geral.
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<DownloadOutlinedIcon htmlColor={common.white} />}
        size="large"
        color="primary"
      >
        <Typography
          textTransform={'capitalize'}
          variant="body1"
          color="common.white"
        >
          Exportar Relatório
        </Typography>
      </Button>
    </Box>
  );
};
