import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const ResumeUserInfos = () => {
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      gap="12px"
      pl="24px"
      borderLeft={'1px solid #00000011'}
    >
      <Box>
        <Typography fontWeight={600} variant="body1" pb="2px">
          Renato Abreu
        </Typography>
        <Typography fontWeight={400} variant="body2" color="text.disabled">
          Trader Sênior
        </Typography>
      </Box>
      <Avatar>RA</Avatar>
    </Box>
  );
};
