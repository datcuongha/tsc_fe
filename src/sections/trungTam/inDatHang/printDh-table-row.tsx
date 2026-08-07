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

export type PrintDhProps = {
  id: string;
  maPhieu: string;
  tenNcc: string;
  status: boolean;
  createDate?: string;
  modifiedDate?: string;
  detailPhieuDeXuat?: {
    id: string;
    chiNhanh: string;
    maPhieuDatHang: string;
    maHang: string;
    tenHang: string;
    giaVon: number;
    nhapChuyen: number;
    xuatBan: number;
    tonCuoi: number;
    slKhoDat: number;
    ngayKhoDat: string;
    ghiChu: string;
  }[];
  detailPhieuDatHang?: {
    tongTienHang: number;
    id: string;
    maHang: string;
    tenSp: string;
    soLuong: number;
    donGia: number;
    thueSuat: string;
  }[];
};

type PrintDhTableRowProps = {
  row: PrintDhProps;
  selected: boolean;
  onSelectRow: () => void;
  printDX: () => void;
  printDDH: () => void;
  editDDH: () => void;
  editDatHangTM: () => void;
  chonLoaiIn: () => void;
};

export function PrintDhTableRow({
  row,
  selected,
  onSelectRow,
  printDX,
  printDDH,
  editDDH,
  editDatHangTM,
  chonLoaiIn,
}: PrintDhTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);
  const tongSl =
    row.detailPhieuDatHang?.reduce((sum, item) => sum + Number(item.soLuong || 0), 0) || 0;

  const tongTienHang = row.detailPhieuDatHang?.reduce((sum, item) => {
    const soLuong = Number(item.soLuong) || 0;
    const donGia = Number(item.donGia) || 0;
    return sum + soLuong * donGia;
  }, 0);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell>{row.maPhieu}</TableCell>
        <TableCell>{row.tenNcc}</TableCell>
        <TableCell>
          {row.createDate && new Date(row.createDate).toLocaleDateString('vi-VN')}
        </TableCell>
        <TableCell>
          {row.modifiedDate && new Date(row.modifiedDate).toLocaleDateString('vi-VN')}
        </TableCell>
        <TableCell>{tongSl}</TableCell>
        <TableCell>{tongTienHang?.toLocaleString('vn-VN')}</TableCell>

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
            width: 210,
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
              chonLoaiIn();
            }}
          >
            <Iconify icon="solar:print-bold" />
            In
          </MenuItem>
          {/* <MenuItem
            onClick={() => {
              handleClosePopover();
              printDX();
            }}
          >
            <Iconify icon="solar:print-bold" />
            In đề xuất
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              printDDH();
            }}
          >
            <Iconify icon="solar:print-bold" />
            In đặt hàng
          </MenuItem> */}

          {/* <MenuItem
            onClick={() => {
              handleClosePopover();
              editDDH();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Cập nhật phiếu đề xuất
          </MenuItem> */}

          <MenuItem
            onClick={() => {
              handleClosePopover();
              editDatHangTM();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Cập nhật đặt hàng
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
