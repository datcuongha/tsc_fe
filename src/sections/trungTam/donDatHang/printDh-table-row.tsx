import { round } from 'es-toolkit';
import { useState, useCallback } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ReplayIcon from '@mui/icons-material/Replay';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------

export type PrintDhProps = {
  id: string;
  maPhieu: string;
  tenNcc: string;
  trangThai: string;
  createDate?: string;
  modifiedDate?: string;
  canApprove?: boolean;
  capDuyet?: number | null;
  phieuDatHangNhap: string;
  phieuDeXuatDetail?: {
    id: string;
    chiNhanh: string;
    maHang: string;
    tenHang: string;
    giaVon: number;
    nhapChuyen: number;
    xuatBan: number;
    tonCuoi: number;
    slKhoDat: number;
    ngayKhoDat: string;
    ghiChuKho: string;
    phieuDatHangNhap:string;
  }[];
  phieuDatHangDetail?: {
    tongTienHang: number;
    id: string;
    maHang: string;
    tenSp: string;
    soLuong: number;
    soLuongPGDDuyet: number;
    soLuongGDDuyet: number;
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
};

export function PrintDhTableRow({
  row,
  selected,
  onSelectRow,
  printDX,
  printDDH,
  editDDH,
  editDatHangTM,
}: PrintDhTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);
  const tongSl =
    row.phieuDatHangDetail?.reduce((sum, item) => sum + Number(item.soLuong || 0), 0) || 0;
  const tongSlPGD =
    row.phieuDatHangDetail?.reduce((sum, item) => sum + Number(item.soLuongPGDDuyet || 0), 0) || 0;
  const tongSGD =
    row.phieuDatHangDetail?.reduce((sum, item) => sum + Number(item.soLuongGDDuyet || 0), 0) || 0;

  const tongTienHang = row.phieuDatHangDetail?.reduce((sum, item) => {
    const soLuong = Number(item.soLuongGDDuyet) || 0;
    const donGia = Number(item.donGia) || 0;
    const thueSuat = Number(item.thueSuat) || 0;
    const thanhTien = soLuong * donGia;
    const tienThue = round(thanhTien * thueSuat);
    const tongSauThue = thanhTien + tienThue;
    return sum + tongSauThue;
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
        <TableCell>
          {tongSlPGD === 0
            ? tongSl
            : tongSGD === 0
              ? `${tongSl}/${tongSlPGD}`
              : `${tongSl}/${tongSlPGD}/${tongSGD}`}
        </TableCell>
        <TableCell>{tongTienHang?.toLocaleString('vn-VN')}</TableCell>
        <TableCell>
          {row.trangThai === 'NHAP' && (
            <>
              <ScheduleIcon color="disabled" />
              Nháp
            </>
          )}

          {row.trangThai === 'CHO_DUYET' && (
            <>
              <HourglassTopIcon color="warning" />
              Chờ duyệt
            </>
          )}

          {row.trangThai === 'DA_DUYET' && (
            <>
              <CheckCircleIcon color="success" />
              Đã duyệt
            </>
          )}

          {row.trangThai === 'TRA_LAI' && (
            <>
              <ReplayIcon color="error" />
              Trả lại
            </>
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
          {/* <MenuItem
            onClick={() => {
              handleClosePopover();
              chonLoaiIn();
            }}
          >
            <Iconify icon="solar:print-bold" />
            In
          </MenuItem> */}

          <MenuItem
            onClick={() => {
              handleClosePopover();
              printDX();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            In đề xuất
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              printDDH();
            }}
            disabled={['CHO_DUYET', 'NHAP', 'TRA_LAI'].includes(row.trangThai)}
          >
            <Iconify icon="solar:pen-bold" />
            In đặt hàng
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              editDatHangTM();
            }}
            disabled={['DA_DUYET', 'TRA_LAI'].includes(row.trangThai)}
          >
            <Iconify icon="solar:pen-bold" />
            Cập nhật đặt hàng
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
