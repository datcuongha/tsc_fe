//           <div className="signature-box">
//             <div className="signature-title">Phó GĐTT/ Trưởng khối vận hành</div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import React from 'react';
// import { useAuth } from 'src/context/authContext';
// import type { InDeXuatProps } from './type';
// export function InDeXuat({ data, handleClose }: InDeXuatProps) {
//   const { user } = useAuth();
//   const fullName = user.data.fullName;
//   const handleExportExcel = () => {
//     const exportData = data.detailPhieuDatHang
//       .filter((item) => Number(item.soLuong) > 0)
//       .map((item: any) => ({
//         'Mã hàng': item.maHang,
//         'Tên sản phẩm': item.tenSp,
//         'Đơn vị tính': item.dvt,
//         'Đơn giá': item.donGia,
//         'Giảm giá': item.giamGia,
//         'Số lượng': item.soLuong,
//       }));
//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'DeXuat');
//     XLSX.writeFile(workbook, 'de-xuat.xlsx');
//   };
//   return (
//     <>
//       <style>
//         {`
//             @page {
//             size: A4 landscape;
//             margin: 7mm;
//             }
//             * {
//               font-family: "Times New Roman", serif !important;
//             }
//             @media print {
//             body * {
//                 visibility: hidden;
//             }
//             .print-page,
//             .print-page * {
//                 visibility: visible;
//             }
//             .print-page {
//                 position: absolute;
//                 left: 0;
//                 top: 0;
//                 width: 100%;
//                 padding: 12px;
//                 background: white;
//             }
//             .no-print,
//             .MuiIconButton-root,
//             .MuiDialogActions-root,
//             button,
//             svg {
//                 display: none !important;
//             }
//             body {
//                 margin: 0;
//                 padding: 0;
//                 background: white;
//             }
//             }
//             .print-page {
//             font-family: Arial, sans-serif;
//             color: black;
//             background: white;
//             padding: 12px;
//             }
//             .header-title {
//             text-align: center;
//             font-size: 24px;
//             font-weight: 700;
//             margin-bottom: 20px;
//             }
//             .info-table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-bottom: 10px;
//             }
//             .info-table td {
//             padding: 6px 10px;
//             font-size: 14px;
//             }
//             .info-label {
//             font-weight: 700;
//             width: 220px;
//             }
//             .main-table {
//             width: 100%;
//             border-collapse: collapse;
//             font-size: 14px;
//             }
//             .main-table th,
//             .main-table td {
//             border: 1px solid #000;
//             padding: 6px;
//             text-align: center;
//             vertical-align: middle;
//             }
//             .main-table th {
//             font-weight: 700;
//             }
//             .purple {
//             color: #6a1b9a;
//             }
//             .orange {
//             color: #d2691e;
//             }
//             .gray {
//             background: #d9d9d9;
//             }
//             .left {
//             text-align: left !important;
//             }
//             .btn-group {
//             display: flex;
//             gap: 10px;
//             margin-bottom: 16px;
//             }
//             .btn {
//             padding: 10px 16px;
//             border: none;
//             border-radius: 8px;
//             cursor: pointer;
//             color: white;
//             font-weight: 600;
//             }
//             .btn-print {
//             background: #1976d2;
//             }
//             .btn-close {
//             background: #d32f2f;
//             }
//             .signature-section {
//             margin-top: 30px;
//             display: flex;
//             justify-content: space-between;
//             width: 100%;
//             }
//             .signature-box {
//             width: 30%;
//             text-align: center;
//             min-height: 120px;
//             }
//             .signature-title {
//             font-size: 18px;
//             font-weight: 700;
//             }
//             .signature-name {
//             text-align: center;
//             margin-top: 100px;
//             font-size: 16px;
//             font-weight: 600;
//             }
//         `}
//       </style>
//       <div className="print-page">
//         <div className="btn-group no-print">
//           <button className="btn btn-print" onClick={handleExportExcel}>
//             Xuất file
//           </button>
//           <button className="btn btn-print" onClick={() => window.print()}>
//             In phiếu
//           </button>
//           <button className="btn btn-close" onClick={handleClose}>
//             Đóng
//           </button>
//         </div>
//         <div className="header-title">ĐỀ XUẤT MUA HÀNG</div>
//         <table className="info-table">
//           <tbody>
//             <tr>
//               <td className="info-label">Nhà cung cấp:</td>
//               <td>
//                 <strong>{data.tenNcc}</strong>
//               </td>
//             </tr>
//             <tr>
//               <td className="info-label">Tên công ty:</td>
//               <td>
//                 <strong>{data.congTy}</strong>
//               </td>
//             </tr>
//             <tr>
//               <td className="info-label">Ngày kho đặt hàng:</td>
//               <td>
//                 <strong>
//                   {data.detailPhieuDatHang?.[0]?.ngayKhoDat
//                     ? new Date(data.detailPhieuDatHang[0].ngayKhoDat).toLocaleDateString('vi-VN')
//                     : ''}
//                 </strong>
//               </td>
//             </tr>
//             <tr>
//               <td className="info-label">Ngày tạo:</td>
//               <td>
//                 <strong>
//                   {data.createDate ? new Date(data.createDate).toLocaleDateString('vi-VN') : ''}
//                 </strong>
//               </td>
//             </tr>
//             {data.detailPhieuDatHang?.[0]?.kySoLieu && (
//               <tr>
//                 <td>Kỳ số liệu tham khảo:</td>
//                 <td>{data.detailPhieuDatHang[0].kySoLieu}</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         <table className="main-table">
//           <thead>
//             <tr>
//               <th>STT</th>
//               <th>Mã hàng</th>
//               <th style={{width:'150px'}}>Tên sản phẩm</th>
//               <th>ĐVT</th>
//               <th>Đơn giá</th>
//               <th>Giảm giá</th>
//               <th>Số lượng</th>
//               <th>Ghi chú hàng hoá</th>
//               <th>Cảnh báo</th>
//               <th style={{width:'100px'}}>SL tồn cuối kỳ tham khảo</th>
//               <th>SL kho đặt</th>
//               <th>SL tồn tối ưu</th>
//               <th>SL có thể đặt</th>
//               <th style={{width:'100px'}}>SL bán kỳ tham khảo</th>
//               <th style={{width:'100px'}}>SL nhập kỳ tham khảo</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.detailPhieuDatHang
//               ?.filter((item) => item.soLuong > 0)
//               .map((item, index) => (
//                 <tr key={item.id}>
//                   <td>{index + 1}</td>
//                   <td>{item.maHang}</td>
//                   <td className="left">{item.tenSp}</td>
//                   <td>{item.dvt}</td>
//                   <td>{Number(item.donGia || 0).toLocaleString('vi-VN')}</td>
//                   <td>{item.giamGia || 0}</td>
//                   <td>{item.soLuong}</td>
//                   <td>{item.ghiChuHangHoa}</td>
//                   <td>{item.canhBao}</td>
//                   <td>{item.tonCuoi}</td>
//                   <td>{item.slKhoDat}</td>
//                   <td>{item.slTonToiUu}</td>
//                   <td>{item.slCoTheDat}</td>
//                   <td>{item.slBanCuoi}</td>
//                   <td>{item.slNhapNccCuoi}</td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//         <div className="signature-section">
//           <div className="signature-box">
//             <div className="signature-title">Người lập</div>
//             <div className="signature-name">{fullName}</div>
//           </div>
//           <div className="signature-box">
//             <div className="signature-title">Thu mua</div>
//             <div className="signature-name">{fullName}</div>
//           </div>
import * as XLSX from 'xlsx';

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
  const printPage = () => {
    window.print();
  };

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
          @page {
            size: A4;
            margin: 7mm;
          }

          @media print {
            body * {
              visibility: hidden;
            }

            #print-area,
            #print-area * {
              visibility: visible;
            }

            #print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              box-shadow: none !important;
            }

            .no-print {
              display: none !important;
            }

            .MuiAppBar-root,
            .MuiDrawer-root,
            header,
            nav,
            aside {
              display: none !important;
            }

            body {
              margin: 0;
              padding: 0;
              font-family: "Times New Roman", serif !important;
            }

            * {
              font-family: "Times New Roman", serif !important;
            }
          }
        `}
      </style>

      <DialogActions className="no-print">
        <Button onClick={handleClose}>Đóng</Button>
        <Button variant="contained" onClick={printPage}>
          In
        </Button>
        <Button variant="contained" color='info' onClick={handleExportExcel}>
          Xuất file
        </Button>
      </DialogActions>

      <Box
        id="print-area"
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
              textAlign:'center',
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
              <TableCell align="center">Cảnh báo</TableCell>
              <TableCell align="center">SL tồn cuối kỳ tham khảo</TableCell>
              <TableCell align="center">SL kho đặt</TableCell>
              <TableCell align="center">SL tồn tối ưu</TableCell>
              <TableCell align="center">SL có thể đặt</TableCell>
              <TableCell align="center">SL bán kỳ tham khảo </TableCell>
              <TableCell align="center">SL nhập kỳ tham khảo</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.detailPhieuDatHang.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{item.maHang}</TableCell>
                <TableCell>{item.tenSp}</TableCell>
                <TableCell align="center">{item.dvt}</TableCell>
                <TableCell align="center">
                  {Number(item.donGia || 0).toLocaleString('vi-VN')}
                </TableCell>
                <TableCell align="center">{item.giamGia}</TableCell>
                <TableCell align="center">{item.soLuong}</TableCell>
                <TableCell align="right">{item.ghiChuHangHoa}</TableCell>
                <TableCell align="right">{item.canhBao}</TableCell>
                <TableCell align="right">{item.tonCuoi}</TableCell>
                <TableCell align="right">{item.slKhoDat}</TableCell>
                <TableCell align="right">{item.slTonToiUu}</TableCell>
                <TableCell align="right">{item.slCoTheDat}</TableCell>
                <TableCell align="right">{item.slBanCuoi}</TableCell>
                <TableCell align="right">{item.slNhapNccCuoi}</TableCell>
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
