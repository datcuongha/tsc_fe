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
  dmLoaiVb: {
    name: string;
  };
  soVb: string;
  ngayVb: string;
  noiDung: string;
  ngayKy: string;
  parentId: number | null;

  boPhan?: {
    id: number;
    name: string;
    status: boolean;
    createDate: string;
    modifiedDate: string | null;
  };

  file: string;

  children?: SoHoaProps[];
};

type SoHoaTableRowProps = {
  row: SoHoaProps;
  selected: boolean;
  onSelectRow: () => void;
  onEditSoHoa: (row: SoHoaProps) => void;
};

export function SoHoaTableRow({
  row,
  selected,
  onSelectRow,
  onEditSoHoa,
  // onChangPass,
}: SoHoaTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [selectedRow, setSelectedRow] = useState<SoHoaProps | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>, item: SoHoaProps) => {
    setSelectedRow(item);
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
    setSelectedRow(null);
  }, []);

  return (
    <>
      <Fragment>
        <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
          <TableCell padding="checkbox">
            <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
          </TableCell>

          <TableCell width={10}>
            {row.children && row.children.length > 0 && (
              <IconButton size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </TableCell>

          <TableCell>{row.dmLoaiVb.name}</TableCell>
          <TableCell>{row.soVb}</TableCell>
          <TableCell>{row.ngayVb && new Date(row.ngayVb).toLocaleDateString('vi-VN')}</TableCell>
          <TableCell>{row.noiDung}</TableCell>
          <TableCell>{row.boPhan?.name}</TableCell>
          <TableCell>{row.ngayKy}</TableCell>

          <TableCell sx={{ paddingLeft: '36px' }}>
            {row.file ? (
              <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
            ) : (
              <HighlightOffIcon sx={{ color: 'error.main' }} />
            )}
          </TableCell>

          <TableCell align="right">
            <IconButton onClick={(e) => handleOpenPopover(e, row)}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        </TableRow>

        {open &&
          row.children?.map((hd) => (
            <TableRow key={hd.id}>
              <TableCell />
              <TableCell />

              <TableCell>
                <Box sx={{ pl: 1 }}>↳ {hd.dmLoaiVb?.name}</Box>
              </TableCell>

              <TableCell>{hd.soVb}</TableCell>

              <TableCell>{hd.ngayVb && new Date(hd.ngayVb).toLocaleDateString('vi-VN')}</TableCell>

              <TableCell>{hd.noiDung}</TableCell>

              <TableCell>{hd.boPhan?.name}</TableCell>

              <TableCell>{hd.ngayKy}</TableCell>

              <TableCell />

              <TableCell align="right">
                <IconButton onClick={(e) => handleOpenPopover(e, hd)}>
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </TableCell>
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

              if (selectedRow) {
                onEditSoHoa(selectedRow);
              }
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Cập nhật
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
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
