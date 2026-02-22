import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box, GlobalStyles, Stack, Typography, useTheme } from '@mui/material';
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ptBR } from '@mui/x-data-grid/locales';
import { SkeletonLoadingTable } from '../Skeleton/SkeletonLoadingTable';

interface DataTableProps<T> {
  rows: T[];
  columns: GridColDef[];
  onRowClick?: (arg: unknown) => void;
  rowCount?: number;
  page?: number;
  pageSize?: number;
  onPaginationModelChange?: (model: { page: number; pageSize: number }) => void;
  loading?: boolean;
}

export const DataTable = <T extends Record<string, unknown>>({
  rows,
  columns,
  onRowClick,
  rowCount = 0,
  page = 0,
  pageSize = 5,
  onPaginationModelChange,
  loading = false,
}: DataTableProps<T>) => {
  const {
    palette: { primary, text, common },
  } = useTheme();
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100vw',
        my: '30px',
        bgcolor: common.white,
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <GlobalStyles
        styles={{
          '.MuiMenu-paper': {
            backgroundColor: '#F8FAFC !important',
            border: '1px solid #E2E8F0 !important',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08) !important',
          },
          '.MuiMenuItem-root.MuiTablePagination-menuItem': {
            fontSize: '14px !important',
            color: '#0F172A !important',
            '&:hover': {
              backgroundColor: '#eff5fc !important',
            },
            '&.Mui-selected': {
              backgroundColor: '#e2e8f0 !important',
              fontWeight: '700 !important',
            },
          },
        }}
      />

      <DataGrid
        loading={loading}
        onRowClick={onRowClick}
        autoHeight
        rows={rows}
        columns={columns}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={onPaginationModelChange}
        slots={{
          loadingOverlay: () => <SkeletonLoadingTable pageSize={pageSize} />,
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              <Typography variant="h2" color="text.secondary">
                Nenhum resultado encontrado.
              </Typography>
            </Stack>
          ),
          columnSortedAscendingIcon: () => <KeyboardArrowUpIcon />,
          columnSortedDescendingIcon: () => <KeyboardArrowDownIcon />,
          columnUnsortedIcon: () => <UnfoldMoreOutlinedIcon />,
        }}
        disableColumnMenu
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-main': { overflow: 'auto' },
          fontSize: '14px',
          fontWeight: 500,
          color: text.primary,
          bgcolor: common.white,
          border: '1px solid #00000016',
          '& .MuiDataGrid-columnHeaders .MuiDataGrid-scrollbarFiller': {
            backgroundColor: '#eff5fc !important',
          },
          //-----ROW-----
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#e9f3fd !important',
            transition: 'background-color 0.2s ease',
            cursor: 'pointer',
          },

          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: '#eff5fc !important',
            '&:hover': {
              backgroundColor: '#e2e8f0 !important',
            },
          },

          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },

          //-----HEADER----
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#eff5fc !important',
          },
          '& .MuiDataGrid-columnHeaders': {
            color: text.disabled,
            fontWeight: 600,
            textTransform: 'capitalize',
            fontSize: '0.875rem',
          },

          //-----CELL----
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-sortIcon': {
            color: text.disabled,
            background: 'transparent !important',
            fontSize: '24px',
          },
          '& .MuiDataGrid-columnHeader .MuiDataGrid-sortButton': {
            background: 'transparent !important',
          },

          '& .MuiDataGrid-columnHeader:hover .MuiDataGrid-sortIcon': {
            color: text.disabled,
            background: 'transparent !important',
          },

          '& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-sortIcon': {
            color: `${text.disabled} !important`,
            opacity: '1 !important',
            background: 'transparent !important',
          },

          //-----FOOTER----
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #F1F5F9',
            minHeight: '52px',
          },

          '& .MuiTablePagination-displayedRows': {
            color: text.disabled,
            fontSize: '0.875rem',
            fontWeight: 500,
          },

          '& .MuiTablePagination-selectLabel': {
            color: text.disabled,
            fontSize: '0.875rem',
          },

          '& .MuiTablePagination-actions': {
            color: primary.main,
          },

          '& .MuiInputBase-root.MuiTablePagination-select': {
            color: '#0f172ac8',
            fontWeight: 600,
            backgroundColor: '#F8FAFC',
            borderRadius: '4px',
            marginRight: '24px',
            border: '1px solid #E2E8F0',
            '&:hover': {
              backgroundColor: '#F1F5F9',
            },
            '&:before, &:after': {
              display: 'none',
            },
          },

          '& .MuiTablePagination-actions button': {
            color: primary.main,
            '&.Mui-disabled': {
              color: '#94A3B8',
              opacity: 0.5,
            },
          },
        }}
      />
    </Box>
  );
};
