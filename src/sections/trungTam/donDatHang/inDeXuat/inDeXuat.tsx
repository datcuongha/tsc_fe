import * as XLSX from 'xlsx';
import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Box,
  Table,
  Button,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TextField,
  DialogActions,
} from '@mui/material';

import { guiDuyet, editDonDeXuat } from 'src/apis/datHang';

import { showAlert } from 'src/components/alert';
import { LoadingBackdrop } from 'src/components/loading';

import type { InDeXuatProps } from './type';

export function InDeXuat({ data, handleClose, userButton }: InDeXuatProps) {
  const duyetCap1 = data.phieuDatHangDuyet?.find(
    (x: any) => x.capDuyet === 1 && x.trangThai === 'DA_DUYET'
  );

  const duyetCap2 = data.phieuDatHangDuyet?.find(
    (x: any) => x.capDuyet === 2 && x.trangThai === 'DA_DUYET'
  );

  const printRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [rows, setRows] = useState(data.phieuDatHangDetail);
  const [editMode, setEditMode] = useState(false);
  const isChoDuyet = data.trangThai === 'CHO_DUYET';
  const daDuyet = data.trangThai === 'DA_DUYET';
  const showPGD = rows.some((item) => item.soLuongPGDDuyet !== null);
  const showGD = rows.some((item) => item.soLuongGDDuyet !== null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Phieu De Xuat-${data.maPhieu}`,
  });

  const handleExportExcel = () => {
    const exportData = data.phieuDatHangDetail
      .filter((item) => Number(item.soLuongGDDuyet) > 0)
      .map((item: any) => ({
        'Mã hàng': item.maHang,
        'Tên sản phẩm': item.tenSp,
        'Đơn vị tính': item.dvt,
        'Đơn giá': item.donGia,
        'Giảm giá': item.giamGia,
        'Số lượng': item.soLuongGDDuyet,
      }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'DeXuat');

    XLSX.writeFile(workbook, 'de-xuat.xlsx');
  };

  const sendMutation = useMutation({
    mutationFn: guiDuyet,

    onSuccess: () => {
      showAlert({
        type: 'success',
        message: 'Đã gửi duyệt',
      });

      queryClient.invalidateQueries({
        queryKey: ['dataDH'],
      });

      handleClose();
    },

    onError: (err) => {
      showAlert({
        type: 'error',
        message: String(err),
      });
    },
  });

  const handleSendEmail = () => {
    sendMutation.mutate(data.id);
  };

  const handleChange = (index: number, field: string, value: string | number) => {
    const updated = [...rows];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setRows(updated);
  };

  const editMutation = useMutation({
    mutationFn: editDonDeXuat,
    onSuccess: () => {
      showAlert({
        type: 'success',
        message: 'Đã cập nhật thành công',
      });
      queryClient.invalidateQueries({
        queryKey: ['dataDH'],
      });
    },
    onError: (error) => {
      showAlert({
        type: 'error',
        message: error?.message || 'Cập nhật thất bại',
      });
    },
  });

  const handleUpdate = () => {
    editMutation.mutate({
      id: data.id,
      phieuDatHangDetail: rows.map((item) => ({
        id: item.id,
        ghiChuHangHoa: item.ghiChuHangHoa || '',
      })),
    });
  };

  const dates = [
    ...new Set(
      (data.phieuDeXuatDetail ?? [])
        .map((x: any) => x.ngayKhoDat)
        .filter(
          (d) => d && d !== '0' && d !== 0 && d !== '0000-00-00' && !isNaN(new Date(d).getTime())
        )
    ),
  ].sort();

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

    }
  `}
      </style>

      <DialogActions className="no-print">
        <Button onClick={handleClose}>Đóng</Button>

        <Button
          color={editMode ? 'success' : 'warning'}
          disabled={isChoDuyet || daDuyet}
          variant="contained"
          onClick={() => {
            if (editMode) {
              handleUpdate();
            } else {
              setEditMode(true);
            }
          }}
        >
          {editMode ? 'Lưu' : 'Sửa thông tin'}
        </Button>

        {daDuyet && (
          <Button variant="contained" color="info" onClick={handleExportExcel}>
            Xuất file Kiot
          </Button>
        )}
        <Button variant="contained" onClick={() => handlePrint()}>
          In
        </Button>
        {userButton?.data?.vaiTroId === 6 && (
          <Button
            variant="contained"
            color="success"
            onClick={handleSendEmail}
            disabled={isChoDuyet || daDuyet}
          >
            {daDuyet ? 'Đã duyệt' : isChoDuyet ? 'Chờ duyệt' : 'Gửi duyệt'}
          </Button>
        )}
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
          <b>Tên công ty:</b> {data.congTy}
        </Box>

        <Box mb={1}>
          <b>Nhà cung cấp:</b> {data.tenNcc}
        </Box>

        <Box mb={1}>
          <b>Ngày kho đặt hàng:</b>{' '}
          {dates.length
            ? dates.length === 1
              ? new Date(dates[0]).toLocaleDateString('vi-VN')
              : `${new Date(dates[0]).toLocaleDateString('vi-VN')} - ${new Date(
                  dates[dates.length - 1]
                ).toLocaleDateString('vi-VN')}`
            : ''}
        </Box>

        <Box mb={1}>
          <b>Phiếu kho đặt hàng:</b>{' '}
          {[...new Set(data.phieuDeXuatDetail.map((x) => x.phieuDatHangNhap).filter(Boolean))].join(
            ', '
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            width: 'auto',
            mx: 'auto',
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'left' }}>
            <Box fontWeight="bold">Nội dung đề xuất như sau:</Box>
          </Box>

          <Box sx={{ flex: 1, textAlign: 'right' }}>
            <Box fontWeight="bold">
              <b>Kỳ số liệu tham khảo:</b>
              {data.fromDate ? new Date(data.fromDate).toLocaleDateString('vi-VN') : ''} -{' '}
              {data.toDate ? new Date(data.toDate).toLocaleDateString('vi-VN') : ''}
            </Box>
          </Box>
        </Box>

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

              <TableCell align="center">TM đề xuất</TableCell>

              {showPGD && <TableCell align="center">PGD duyệt</TableCell>}

              {showGD && <TableCell align="center">GD duyệt</TableCell>}

              <TableCell align="center">Ghi chú hàng hoá</TableCell>

              <TableCell align="center">SL kho đặt</TableCell>

              <TableCell align="center">Chênh lệch Tồn cuối và Tồn tối ưu</TableCell>

              <TableCell align="center">SL tồn tối ưu</TableCell>

              <TableCell align="center">SL tồn cuối kỳ</TableCell>

              <TableCell align="center">SL bán kỳ</TableCell>

              <TableCell align="center">SL nhập kỳ</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((item, index) => {
              const code = item.maHang?.trim().toUpperCase();

              const xntByCode =
                data.xntDetail?.filter((x) => x.maHang?.trim().toUpperCase() === code) ?? [];

              const totalXnt = xntByCode.reduce(
                (total, x) => ({
                  tonCuoi: total.tonCuoi + (Number(x.tonCuoi) || 0),
                  xuatBan: total.xuatBan + (Number(x.xuatBan) || 0),
                }),
                {
                  tonCuoi: 0,
                  xuatBan: 0,
                }
              );

              const tonCuoi = Number(item.tonCuoi) || totalXnt.tonCuoi || 0;

              const slBanCuoi = Number(item.slBanCuoi) || totalXnt.xuatBan || 0;

              const slTonToiUu = Number(item.slTonToiUu) || Number(xntByCode[0]?.slTonToiUu) || 0;
              return (
                <TableRow key={`${item.id}-${index}`}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell sx={{ width: 120 }}>{item.maHang}</TableCell>
                  <TableCell sx={{ width: 180 }}>{item.tenSp}</TableCell>
                  <TableCell align="center">{item.dvt}</TableCell>
                  <TableCell align="center" sx={{ width: 65 }}>
                    {Number(item.donGia || 0).toLocaleString('vi-VN')}
                  </TableCell>
                  <TableCell align="center" sx={{ width: 50 }}>
                    {item.soLuong}
                  </TableCell>
                  {showPGD && (
                    <TableCell align="center" sx={{ width: 45 }}>
                      {item.soLuongPGDDuyet}
                    </TableCell>
                  )}
                  {showGD && (
                    <TableCell align="center" sx={{ width: 45 }}>
                      {item.soLuongGDDuyet}
                    </TableCell>
                  )}
                  <TableCell>
                    {editMode ? (
                      <TextField
                        variant="standard"
                        multiline
                        fullWidth
                        InputProps={{ disableUnderline: true }}
                        value={item.ghiChuHangHoa || ''}
                        onChange={(e) => handleChange(index, 'ghiChuHangHoa', e.target.value)}
                      />
                    ) : (
                      item.ghiChuHangHoa
                    )}
                  </TableCell>

                  <TableCell align="center" sx={{ width: 55 }}>
                    {item.slKhoDat}
                  </TableCell>

                  <TableCell align="center" sx={{ width: 120 }}>
                    {item.slCoTheDat}
                  </TableCell>

                  <TableCell align="center" sx={{ width: 55 }}>
                    {slTonToiUu}
                  </TableCell>

                  <TableCell align="center" sx={{ width: 55 }}>
                    {tonCuoi}
                  </TableCell>

                  <TableCell align="center" sx={{ width: 55 }}>
                    {slBanCuoi}
                  </TableCell>

                  <TableCell align="center" sx={{ width: 55 }}>
                    {item.slNhapNccCuoi}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          {/* <TableBody>
            {rows.map((item, index) => {
              const code = item.maHang?.trim().toUpperCase();

              const xntByCode =
                data.xntDetail?.find((x) => x.maHang?.trim().toUpperCase() === code) ?? null;

              const slTonToiUu = Number(item.slTonToiUu) || Number(xntByCode?.slTonToiUu) || 0;

              const tonCuoi = Number(item.tonCuoi) || Number(xntByCode?.tonCuoi) || 0;

              const slBanCuoi = Number(item.slBanCuoi) || Number(xntByCode?.xuatBan) || 0;

              const slNhapNccCuoi = Number(item.slNhapNccCuoi) || Number(xntByCode?.nhapNcc) || 0;

              return (
                <TableRow key={`${item.id}-${index}`}>
                  <TableCell align="center">{index + 1}</TableCell>

                  <TableCell sx={{ width: 120 }}>{item.maHang}</TableCell>

                  <TableCell sx={{ width: 180 }}>{item.tenSp}</TableCell>

                  <TableCell align="center">{item.dvt}</TableCell>

                  <TableCell align="center" sx={{ width: 65 }}>
                    {Number(item.donGia || 0).toLocaleString('vi-VN')}
                  </TableCell>

                  <TableCell align="center" sx={{ width: 50 }}>
                    {item.soLuong}
                  </TableCell>

                  {showPGD && (
                    <TableCell align="center" sx={{ width: 45 }}>
                      {item.soLuongPGDDuyet}
                    </TableCell>
                  )}

                  {showGD && (
                    <TableCell align="center" sx={{ width: 45 }}>
                      {item.soLuongGDDuyet}
                    </TableCell>
                  )}

                  <TableCell>
                    {editMode ? (
                      <TextField
                        variant="standard"
                        multiline
                        fullWidth
                        InputProps={{
                          disableUnderline: true,
                        }}
                        value={item.ghiChuHangHoa || ''}
                        onChange={(e) => handleChange(index, 'ghiChuHangHoa', e.target.value)}
                      />
                    ) : (
                      item.ghiChuHangHoa
                    )}
                  </TableCell>

                  <TableCell align="center" sx={{ width: 55 }}>
                    {item.slKhoDat}
                  </TableCell>

                  <TableCell align="center" sx={{ width: 120 }}>
                    {item.slCoTheDat}
                  </TableCell>

                  <TableCell align="center" sx={{ width: 55 }}>
                    {slTonToiUu}
                  </TableCell>

                  <TableCell align="center" sx={{ width: 55 }}>
                    {tonCuoi}
                  </TableCell>

                  <TableCell align="center" sx={{ width: 55 }}>
                    {slBanCuoi}
                  </TableCell>

                  <TableCell align="center" sx={{ width: 55 }}>
                    {slNhapNccCuoi}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody> */}
        </Table>

        {data.lyDoTraLai !== null && (
          <Box m={1}>
            <b>Lý do trả lại: </b>
            {data.lyDoTraLai}
          </Box>
        )}
        {/* FOOTER */}

        {/* SIGN */}
        <Box
          sx={{
            display: 'flex',
            mt: 4,
            width: 'auto',
            mx: 'auto',
            minHeight: '30mm',
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Box fontWeight="bold">THU MUA </Box>
            <Box fontWeight="bold" mt={21}>
              {data.tenNguoiGui}
            </Box>
            {data.ngayGui && (
              <Box fontWeight="bold" mt={1}>
                Ngày đề xuất: {data.ngayGui ? new Date(data.ngayGui).toLocaleString('vi-VN') : ''}
              </Box>
            )}
          </Box>

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Box fontWeight="bold">PHÓ GĐTT / TRƯỞNG KHỐI VẬN HÀNH</Box>
            <Box fontWeight="bold" mt={21}>
              {duyetCap1?.users?.fullName ?? ''}
            </Box>
            {duyetCap1?.ngayDuyet && (
              <Box fontWeight="bold" mt={1}>
                Ngày xét duyệt:{' '}
                {duyetCap1?.ngayDuyet ? new Date(duyetCap1?.ngayDuyet).toLocaleString('vi-VN') : ''}
              </Box>
            )}
          </Box>

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Box fontWeight="bold">GIÁM ĐỐC TRUNG TÂM</Box>
            <Box fontWeight="bold" mt={21}>
              {duyetCap2?.users?.fullName ?? ''}
            </Box>
            {duyetCap2?.ngayDuyet && (
              <Box fontWeight="bold" mt={1}>
                Ngày phê duyệt:{' '}
                {duyetCap2?.ngayDuyet ? new Date(duyetCap2?.ngayDuyet).toLocaleString('vi-VN') : ''}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <LoadingBackdrop open={sendMutation.isPending} message="Đang xử lý, vui lòng chờ..." />
    </>
  );
}
