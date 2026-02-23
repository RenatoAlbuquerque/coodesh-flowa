export const scrollDisplay = {
  overflow: 'auto',

  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },

  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#cbd5e1',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: '#94a3b8',
    },
  },

  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f5f9',
  },

  '&::-webkit-scrollbar-button': {
    display: 'none',
  },

  scrollbarWidth: 'thin',
  scrollbarColor: '#cbd5e1 #f1f5f9',
};
