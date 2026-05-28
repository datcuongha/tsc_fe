import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { doReadNumber, ReadingConfig } from 'read-vietnamese-number';

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

import type { InDonDatHangProps } from './type';

export function InDonDatHang({ data, handleClose }: InDonDatHangProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const tongTienHang = data.detailPhieuDatHang.reduce((sum, item) => {
    const soLuong = Number(item.soLuong) || 0;
    const donGia = Number(item.donGia) || 0;
    return sum + soLuong * donGia;
  }, 0);

  const taxGroups = data.detailPhieuDatHang.reduce(
    (acc, item) => {
      const soLuong = Number(item.soLuong) || 0;
      const donGia = Number(item.donGia) || 0;
      const thueSuat = Number(item.thueSuat) || 0;

      const thanhTien = soLuong * donGia;
      const tienThue = thanhTien * thueSuat;

      if (!acc[thueSuat]) acc[thueSuat] = 0;
      acc[thueSuat] += tienThue;

      return acc;
    },
    {} as Record<number, number>
  );

  const tienThue5 = taxGroups[0.05] || 0;
  const tienThue8 = taxGroups[0.08] || 0;
  const tienThue10 = taxGroups[0.1] || 0;

  const tongTienThue = tienThue5 + tienThue8 + tienThue10;
  const tongThanhToan = tongTienHang + tongTienThue;

  const config = new ReadingConfig();
  config.unit = ['đồng'];

  const moneyText = doReadNumber(String(Math.round(tongThanhToan)), config);

  const today = new Date();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Don-dat-hang-${data.maPhieu}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 7mm;
      }

      @media print {
        body {
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: "Times New Roman", serif !important;
        }

        * {
          font-family: "Times New Roman", serif !important;
        }
      }
    `,
  });

  return (
    <>
      <DialogActions className="no-print">
        <Button onClick={handleClose}>Đóng</Button>
        <Button variant="contained" onClick={handlePrint}>
          In
        </Button>
      </DialogActions>

      <Box
        ref={printRef}
        sx={{
          width: '210mm',
          minHeight: '297mm',
          background: '#fff',
          color: '#000',
          p: 1,
          pb: '30mm',
          fontFamily: '"Times New Roman", serif',
          fontSize: 14,
          boxSizing: 'border-box',
          margin: '0 auto',

          '@media screen': {
            boxShadow: 3,
          },

          '@media print': {
            boxShadow: 'none',
          },
        }}
      >
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
        <Box textAlign="center" mb={2}>
          <Box fontSize={24} fontWeight="bold">
            ĐƠN ĐẶT HÀNG
          </Box>
          <Box>Số: {data.maPhieu}</Box>
        </Box>
        <Box textAlign="right" mb={2}>
          Ngày {today.getDate()} tháng {today.getMonth() + 1} năm {today.getFullYear()}
        </Box>
        <Box mb={1}>
          - <b>Kính gửi: {data.congTy}</b>
        </Box>
        <Box mb={1}>- Địa chỉ: {data.diaChi}</Box>
        <Box mb={1}>- Mã số thuế: {data.mst}</Box>
        <Box mt={1}>
          {' '}
          <b>
            CHI NHÁNH CÔNG TY CỔ PHẦN THƯƠNG MẠI - DỊCH VỤ BẾN THÀNH - TRUNG TÂM BẾN THÀNH ĐÔNG
          </b>{' '}
        </Box>{' '}
        <Box>có nhu cầu đặt hàng tại Quý công ty theo mẫu yêu cầu.</Box>{' '}
        <Box>
          {' '}
          - Địa chỉ giao hàng: Hành lang cửa Đông Nam và Cửa Đông Bắc Chợ Bến Thành, phường Bến
          Thành, Thành phố Hồ Chí Minh{' '}
        </Box>{' '}
        <Box>Thời hạn giao hàng: Trong vòng 7 ngày làm việc kể từ ngày ký đơn đặt hàng.</Box>{' '}
        <Box>Nội dung đặt hàng như sau:</Box>
        <Table
          sx={{
            border: '1px solid black',
            '& td, & th': {
              border: '1px solid black',
              padding: '2.5px',
              fontFamily: '"Times New Roman", serif',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">STT</TableCell>
              <TableCell align="center">Tên hàng</TableCell>
              <TableCell align="center">ĐVT</TableCell>
              <TableCell align="center">Số lượng</TableCell>
              <TableCell align="center">Đơn giá</TableCell>
              <TableCell align="center">Thành tiền</TableCell>
              <TableCell align="center">Mức thuế suất</TableCell>
              <TableCell align="center">Tiền thuế GTGT</TableCell>
              <TableCell align="center">Thành tiền sau thuế GTGT</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.detailPhieuDatHang
              .filter((item) => Number(item.soLuong) > 0)
              .map((item, index) => {
                const soLuong = Number(item.soLuong) || 0;
                const donGia = Number(item.donGia) || 0;
                const thueSuat = Number(item.thueSuat) || 0;

                const thanhTien = soLuong * donGia;
                const tienThue = thanhTien * thueSuat;
                const tongSauThue = thanhTien + tienThue;

                return (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{item.tenSp}</TableCell>
                    <TableCell align="center">{item.dvt}</TableCell>
                    <TableCell align="center">{soLuong.toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="right">{donGia.toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="right">{thanhTien.toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="center">{(thueSuat * 100).toFixed(0)}%</TableCell>
                    <TableCell align="right">{tienThue.toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="right">{tongSauThue.toLocaleString('vi-VN')}</TableCell>
                  </TableRow>
                );
              })}
            <TableRow>
              <TableCell colSpan={8} align="right">
                <b>Cộng tiền hàng:</b>
              </TableCell>
              <TableCell align="right">
                <b>{tongTienHang.toLocaleString('vi-VN')}</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={8} align="right">
                <b>Tiền thuế GTGT 5%:</b>
              </TableCell>
              <TableCell align="right">
                <b>{tienThue5.toLocaleString('vi-VN')}</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={8} align="right">
                <b>Tiền thuế GTGT 8%:</b>
              </TableCell>
              <TableCell align="right">
                <b>{tienThue8.toLocaleString('vi-VN')}</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={8} align="right">
                <b>Tiền thuế GTGT 10%:</b>
              </TableCell>
              <TableCell align="right">
                <b>{tienThue10.toLocaleString('vi-VN')}</b>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={8} align="right">
                <b>Tổng thanh toán:</b>
              </TableCell>
              <TableCell align="right">
                <b>{tongThanhToan.toLocaleString('vi-VN')}</b>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box mt={3}>
          <Box>
            Tổng số tiền (viết bằng chữ):{' '}
            <b>{moneyText.charAt(0).toUpperCase() + moneyText.slice(1)} chẵn.</b>
          </Box>

          <Box>Đơn đặt hàng là 1 bộ phận không tách rời của hợp đồng số {data.ghiChuHopDong}</Box>

          <Box>Đơn đặt hàng lập thành 02 bản có giá trị như nhau, mỗi Bên giữ 01 bản</Box>
        </Box>
        {/* SIGN */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 3,
            px: 12,
            textAlign: 'center',
            minHeight: '25mm',
          }}
        >
          <Box>
            <Box fontWeight="bold">NGƯỜI LẬP</Box>
            {/* <Box mt={8}>(Ký, ghi rõ họ tên)</Box> */}
          </Box>

          <Box>
            <Box fontWeight="bold">GIÁM ĐỐC</Box>
            {/* <Box mt={8}>(Ký, đóng dấu)</Box> */}
          </Box>
        </Box>
      </Box>
    </>
  );
}
