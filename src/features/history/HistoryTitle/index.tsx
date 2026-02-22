import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { useTheme } from '@mui/material';

export const HistoryTitle = () => {
  const {
    palette: { text },
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
          Histórico de Eventos
        </Typography>
        <Typography variant="h2" fontWeight={400} color="text.disabled">
          Acompanhe o log completo de criações, execuções e cancelamentos de
          ordens.
        </Typography>
      </Box>
      <Button
        variant="outlined"
        startIcon={<DownloadOutlinedIcon htmlColor={text.primary} />}
        sx={{ borderColor: '#cacaca' }}
        size="large"
      >
        <Typography
          textTransform={'capitalize'}
          variant="body1"
          color="text.primary"
        >
          Exportar Relatório
        </Typography>
      </Button>
    </Box>
  );
};
