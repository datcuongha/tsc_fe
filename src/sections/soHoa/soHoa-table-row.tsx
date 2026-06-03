import { useState, Fragment, useCallback } from 'react';

import { Box } from '@mui/material';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------

export type SoHoaProps = {
  id: number;
  loaiVb: string;
  soVb: string;
  ngayVb: string;
  noiDung: string;
  boPhan: string;
  file: string;
  hopDongs?: {
    id: number;
    loaiVb: string;
    soVb: string;
    ngayVb: string;
    noiDung: string;
    boPhan?: string;
    file: string;
  }[];
};

type SoHoaTableRowProps = {
  row: SoHoaProps;
  selected: boolean;
  onSelectRow: () => void;
  // onEditUser: () => void;
  // onChangPass: () => void;
};

export function SoHoaTableRow({
  row,
  selected,
  onSelectRow,
  // onEditUser,
  // onChangPass,
}: SoHoaTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <Fragment>
        <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
          <TableCell padding="checkbox">
            <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
          </TableCell>

          <TableCell width={10}>
            {row.hopDongs && row.hopDongs.length > 0 && (
              <IconButton size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </TableCell>

          <TableCell>{row.loaiVb}</TableCell>
          <TableCell>{row.soVb}</TableCell>
          <TableCell>{row.ngayVb}</TableCell>
          <TableCell>{row.noiDung}</TableCell>
          <TableCell>{row.boPhan}</TableCell>

          <TableCell sx={{ paddingLeft: '36px' }}>
            {row.file ? (
              <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
            ) : (
              <HighlightOffIcon sx={{ color: 'error.main' }} />
            )}
          </TableCell>

          <TableCell align="right">
            <IconButton onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        </TableRow>

        {open &&
          row.hopDongs?.map((hd) => (
            <TableRow key={hd.id}>
              <TableCell />
              <TableCell />

              <TableCell>
                <Box sx={{ pl: 3 }}>↳ {hd.loaiVb}</Box>
              </TableCell>

              <TableCell>{hd.soVb}</TableCell>

              <TableCell>{hd.ngayVb}</TableCell>

              <TableCell>{hd.noiDung}</TableCell>

              <TableCell>{hd.boPhan}</TableCell>

              <TableCell sx={{ pl: 4.4 }}>
                {hd.file ? (
                  <Iconify icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
                ) : (
                  <HighlightOffIcon sx={{ color: 'error.main' }} />
                )}
              </TableCell>

              <TableCell />
            </TableRow>
          ))}
      </Fragment>

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
              // onEditUser();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Cập nhật
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              // onChangPass();
            }}
          >
            <Iconify icon="custom:change-pass" />
            In
          </MenuItem>

          <MenuItem>
            <Iconify icon="custom:admin-role-permission" />
            Up file
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
