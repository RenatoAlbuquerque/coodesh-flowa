import Box from '@mui/material/Box';
import React from 'react';

export const ContainerCenter = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box
      width={'100%'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Box width={'100%'} maxWidth={'1080px'} px="10px" overflow={'hidden'}>
        {children}
      </Box>
    </Box>
  );
};
