import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

export type DonHangFiltersState = {
  ncc: string[];
  chiNhanh: string[];
  fromDate: string;
  toDate: string;
  month: string;       
  year: string;
};

type Props = {
  canReset: boolean;
  openFilter: boolean;
 
  filters: DonHangFiltersState;

  onCloseFilter: () => void;
  onResetFilter: () => void;
  onSetFilters: (updateState: Partial<DonHangFiltersState>) => void;

  options: {
    ncc: string[];
    chiNhanh: string[];
    years: string[];
  };
};

export function DonHangFilters({
  filters,
  options,
  canReset,
  openFilter,
  onCloseFilter,
  onResetFilter,
  onSetFilters,
}: Props) {
  return (
    <Drawer
      anchor="right"
      open={openFilter}
      onClose={onCloseFilter}
      slotProps={{
        paper: {
          sx: {
            width: 400,
            overflow: 'hidden',
          },
        },
      }}
    >
      <Box
        sx={{
          py: 2,
          px: 2.5,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Bộ lọc đơn hàng
        </Typography>

        <IconButton onClick={onResetFilter}>
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>

        <IconButton onClick={onCloseFilter}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          {/* NCC */}
          <Autocomplete
            multiple
            options={options.ncc}
            value={filters.ncc}
            onChange={(_, value) =>
              onSetFilters({
                ncc: value,
              })
            }
            renderInput={(params) => <TextField {...params} label="Nhà cung cấp" size="small" />}
          />

          {/* Chi nhánh */}
          <Autocomplete
            multiple
            options={options.chiNhanh}
            value={filters.chiNhanh}
            onChange={(_, value) =>
              onSetFilters({
                chiNhanh: value,
              })
            }
            renderInput={(params) => <TextField {...params} label="Chi nhánh" size="small" />}
          />

          <Divider />

          {/* Từ ngày */}
          <TextField
            label="Từ ngày"
            type="date"
            size="small"
            value={filters.fromDate}
            onChange={(e) =>
              onSetFilters({
                fromDate: e.target.value,
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Đến ngày */}
          <TextField
            label="Đến ngày"
            type="date"
            size="small"
            value={filters.toDate}
            onChange={(e) =>
              onSetFilters({
                toDate: e.target.value,
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Tháng */}
          <Autocomplete
            options={['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']}
            value={filters.month}
            onChange={(_, value) =>
              onSetFilters({
                month: value || '',
              })
            }
            renderInput={(params) => <TextField {...params} label="Tháng" size="small" />}
          />

          {/* Năm */}
          <Autocomplete
            options={options.years}
            value={filters.year}
            onChange={(_, value) =>
              onSetFilters({
                year: value || '',
              })
            }
            renderInput={(params) => <TextField {...params} label="Năm" size="small" />}
          />
        </Stack>
      </Scrollbar>
    </Drawer>
  );
}
