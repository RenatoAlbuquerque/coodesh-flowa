import Box from '@mui/material/Box';
import { ResumeUserInfos } from '../../molecules/ResumeUserInfos';
import IconButton from '@mui/material/IconButton';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';

export const Header = () => {
  return (
    <Box
      height={'72px'}
      width={'100%'}
      borderBottom={'1px solid #00000015'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      gap="24px"
    >
      <Box
        width={'100%'}
        maxWidth={'1080px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'flex-end'}
        px="10px"
        gap="20px"
      >
        <IconButton sx={{ border: '1px solid #00000015' }} size="small">
          <NotificationsActiveOutlinedIcon />
        </IconButton>
        <ResumeUserInfos />
      </Box>
    </Box>
  );
};
