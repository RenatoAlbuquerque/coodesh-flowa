import { Box, Skeleton, Stack } from '@mui/material';

export const SkeletonLoadingTable = ({ pageSize }: { pageSize: number }) => {
  return (
    <Stack spacing={0}>
      {Array.from(new Array(pageSize)).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: 52,
            width: '100%',
            px: 2,
            borderBottom: '1px solid #F1F5F9',
          }}
        >
          <Skeleton variant="text" width="100%" height={30} animation="wave" />
        </Box>
      ))}
    </Stack>
  );
};
