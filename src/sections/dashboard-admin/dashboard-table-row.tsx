import { useState, useCallback } from 'react';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Popover,
  Checkbox,
  MenuItem,
  MenuList,
  TableRow,
  TableCell,
  IconButton,
  menuItemClasses,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

export type DashboardProps = {
  id: string;
  title: string;
  link: string;
  status: boolean;
};

type DashboardTableRowProps = {
  row: DashboardProps;
  selected: boolean;
  onSelectRow: () => void;
  onEditRow: () => void;
  // onViewRow: () => void,
};

export function DashboardTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
}: DashboardTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row.title}</TableCell>

        <TableCell>{row.link ? 'Giấu rồi nha' : ''}</TableCell>

        <TableCell sx={{ paddingLeft: '36px' }}>
          {row.status ? (
            <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
          ) : (
            <HighlightOffIcon width={22} sx={{ color: 'error.main' }} />
          )}
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleClosePopover();
              onEditRow();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          {/* <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:print-bold" />
            Print
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              // onViewRow()
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem> */}
        </MenuList>
      </Popover>
    </>
  );
}
