import * as XLSX from 'xlsx';
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import {
  Box,
  Table,
  Button,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  DialogActions,
} from '@mui/material';

import { useAuth } from 'src/context/authContext';

import type { InDeXuatProps } from './type';

export function InDeXuat({ data, handleClose }: InDeXuatProps) {
  const { user } = useAuth();
  const fullName = user.data.fullName;
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const handleExportExcel = () => {
    const exportData = data.detailPhieuDatHang
      .filter((item) => Number(item.soLuong) > 0)
      .map((item: any) => ({
        'Mã hàng': item.maHang,
        'Tên sản phẩm': item.tenSp,
        'Đơn vị tính': item.dvt,
        'Đơn giá': item.donGia,
        'Giảm giá': item.giamGia,
        'Số lượng': item.soLuong,
      }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'DeXuat');

    XLSX.writeFile(workbook, 'de-xuat.xlsx');
  };

  return (
    <>
      <style>
        {`
    @media print {

      @page {
        size: A4 landscape;
        margin: 7mm;
      }

      html,
      body {
        width: 297mm !important;

        margin: 0 !important;
        padding: 0 !important;

        background: #fff !important;
      }

      body * {
        visibility: hidden;
      }

      #print-area,
      #print-area * {
        visibility: visible;
      }

      #print-area {
        width: 100% !important;

        box-shadow: none !important;

        overflow: visible !important;
      }

      table {
        width: 100%;
        border-collapse: collapse;

        page-break-inside: auto;
      }

      thead {
        display: table-header-group;
      }

      tfoot {
        display: table-footer-group;
      }

      tr,
      td,
      th {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      tr {
        page-break-after: auto;
      }

      .no-print,
      .MuiAppBar-root,
      .MuiDrawer-root,
      header,
      nav,
      aside {
        display: none !important;
      }

      body,
      * {
        font-family: "Times New Roman", serif !important;
      }
    }
  `}
      </style>

      <DialogActions className="no-print">
        <Button onClick={handleClose}>Đóng</Button>
        <Button variant="contained" onClick={() => handlePrint()}>
          In
        </Button>
        <Button variant="contained" color="info" onClick={handleExportExcel}>
          Xuất file
        </Button>
      </DialogActions>

      <Box
        id="print-area"
        ref={printRef}
        sx={{
          width: '297mm',

          background: '#fff',
          color: '#000',

          p: 1,
          pb: '20mm',

          fontFamily: '"Times New Roman", serif',
          fontSize: 13,

          boxSizing: 'border-box',

          margin: '0 auto',

          '@media screen': {
            boxShadow: 3,
          },
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Box textAlign="center">
            <Box fontWeight="bold">CN CÔNG TY CP TM-DV BẾN THÀNH</Box>
            <Box>Trung tâm Bến Thành Đông</Box>
          </Box>

          <Box textAlign="center">
            <Box fontWeight="bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Box>
            <Box>Độc lập - Tự do - Hạnh phúc</Box>
          </Box>
        </Box>

        {/* TITLE */}
        <Box textAlign="center" mb={3}>
          <Box fontSize={24} fontWeight="bold">
            PHIẾU ĐỀ XUẤT ĐẶT HÀNG
          </Box>
        </Box>

        {/* INFO */}
        <Box mb={1}>
          <b>Nhà cung cấp:</b> {data.congTy}
        </Box>

        <Box mb={1}>
          <b>Tên công ty:</b> {data.tenNcc}
        </Box>
        <Box mb={1}>
          <b>Ngày kho đặt hàng:</b>{' '}
          {data.detailPhieuDatHang?.[0]?.ngayKhoDat
            ? new Date(data.detailPhieuDatHang[0].ngayKhoDat).toLocaleDateString('vi-VN')
            : ''}
        </Box>
        <Box mb={1}>
          <b>Phiếu kho đặt hàng:</b> {data.maDatHangNhap}
        </Box>

        <Box mb={1}>
          <b>Ngày thu mua đặt:</b>{' '}
          {data.createDate ? new Date(data.createDate).toLocaleDateString('vi-VN') : ''}
        </Box>

        {data.detailPhieuDatHang?.[0]?.kySoLieu?.trim() && (
          <Box mb={1}>
            <b>Kỳ số liệu tham khảo:</b> {data.detailPhieuDatHang[0].kySoLieu}
          </Box>
        )}

        <Box mb={1}>Nội dung đề xuất như sau:</Box>

        {/* TABLE */}
        <Table
          sx={{
            border: '1px solid black',
            '& td, & th': {
              border: '1px solid black',
              padding: '4px',
              fontFamily: '"Times New Roman", serif',
              fontSize: 13,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">STT</TableCell>
              <TableCell align="center">Mã hàng</TableCell>
              <TableCell align="center">Tên sản phẩm</TableCell>
              <TableCell align="center">ĐVT</TableCell>
              <TableCell align="center">Đơn giá</TableCell>
              <TableCell align="center">Giảm giá</TableCell>
              <TableCell align="center">Số lượng</TableCell>
              <TableCell align="center">Ghi chú hàng hoá</TableCell>
              <TableCell align="center">SL tồn cuối kỳ tham khảo</TableCell>
              <TableCell align="center">SL kho đặt</TableCell>
              <TableCell align="center">SL tồn tối ưu</TableCell>
              <TableCell align="center">Chênh lệch Tồn cuối và Tồn tối ưu</TableCell>
              <TableCell align="center">SL bán kỳ tham khảo </TableCell>
              <TableCell align="center">SL nhập kỳ tham khảo</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.detailPhieuDatHang.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell sx={{ width: 120 }}>{item.maHang}</TableCell>
                <TableCell sx={{ width: 150 }}>{item.tenSp}</TableCell>
                <TableCell align="center">{item.dvt}</TableCell>
                <TableCell align="center">
                  {Number(item.donGia || 0).toLocaleString('vi-VN')}
                </TableCell>
                <TableCell align="center">{item.giamGia}</TableCell>
                <TableCell align="center">{item.soLuong}</TableCell>
                <TableCell align="center"sx={{ width: 100 }}>{item.ghiChuHangHoa}</TableCell>
                <TableCell align="center" sx={{ width: 90 }}>
                  {item.tonCuoi}
                </TableCell>
                <TableCell align="center" sx={{ width: 90 }}>
                  {item.slKhoDat}
                </TableCell>
                <TableCell align="center">{item.slTonToiUu}</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>
                  {item.slCoTheDat}
                </TableCell>
                <TableCell align="center" sx={{ width: 90 }}>
                  {item.slBanCuoi}
                </TableCell>
                <TableCell align="center" sx={{ width: 90 }}>
                  {item.slNhapNccCuoi}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* FOOTER */}

        {/* SIGN */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 4,
            width: '80%',
            mx: 'auto',
            textAlign: 'center',
            minHeight: '30mm',
          }}
        >
          <Box>
            <Box fontWeight="bold">NGƯỜI LẬP</Box>
            <Box fontWeight="bold" mt={18}>
              {fullName}
            </Box>
          </Box>

          <Box>
            <Box fontWeight="bold">THU MUA </Box>
            <Box fontWeight="bold" mt={18}>
              {fullName}
            </Box>
          </Box>

          <Box>
            <Box
              fontWeight="bold"
              sx={{
                maxWidth: '160px',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                // lineHeight: 1.4,
                textAlign: 'center',
              }}
            >
              PHÓ GĐTT / TRƯỞNG KHỐI VẬN HÀNH
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
