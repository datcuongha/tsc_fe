import { useState, useCallback } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------

export type SoHoaProps = {
  userId: string;
  userName: string;
  pass: string;
  confirmPass: string;
  email: string;
  brithday?: string;
  phone?: string;
  fullName: string;
  address?: string;
  status: boolean;
};

type SoHoaTableRowProps = {
  row: SoHoaProps;
  selected: boolean;
  onSelectRow: () => void;
  onEditUser: () => void;
  onChangPass: () => void;
};

export function UserTableRow({
  row,
  selected,
  onSelectRow,
  onEditUser,
  onChangPass,
}: SoHoaTableRowProps) {
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

        {/* <TableCell component="th" scope="row">
          <Box
            sx={{
              gap: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar alt={row.name} src={row.avatarUrl} />
            {row.name}
          </Box>
        </TableCell> */}

        <TableCell>{row.userName}</TableCell>
        <TableCell>{row.fullName}</TableCell>
        <TableCell>{row.phone}</TableCell>
        <TableCell>{row.email}</TableCell>

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
              onEditUser();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Cập nhật
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              onChangPass();
            }}
          >
            <Iconify icon="custom:change-pass" />
            Đổi mật khẩu
          </MenuItem>

          <MenuItem>
            <Iconify icon='custom:admin-role-permission' />
            Phân quyền
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
