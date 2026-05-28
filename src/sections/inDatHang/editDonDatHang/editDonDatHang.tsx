import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Grid from '@mui/material/GridLegacy';
import {
  Table,
  Paper,
  Button,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
} from '@mui/material';

import { editDonDeXuat } from 'src/apis/datHang';

import { showAlert } from 'src/components/alert';
import { CalenderCustom } from 'src/components/calender';

import type { EditDDHProps } from './type';

export function EditDonDatHang({ handleClose, data }: EditDDHProps) {
  const queryClient = useQueryClient();

  const [rows, setRows] = useState(data.detailPhieuDatHang);

  const [dateRange, setDateRange] = useState<{
    fromDate: Date | null;
    toDate: Date | null;
  }>({
    fromDate: null,
    toDate: null,
  });

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
      handleClose();
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
  const formatDate = (date: Date | null) => {
    if (!date) return '';

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  };
  const handleUpdate = () => {
    const kySoLieu = `Từ ngày ${formatDate(dateRange.fromDate)} - ${formatDate(dateRange.toDate)}`;
    editMutation.mutate({
      id: data.id,
      detailPhieuDatHang: rows.map((item) => ({
        id: item.id,
        kySoLieu,
        giamGia: item.giamGia || 0,
        ghiChuHangHoa: item.ghiChuHangHoa || '',
      })),
    });
  };

  return (
    <>
      <DialogTitle>Cập nhật phiếu đề xuất</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} my={2}>
          <Grid item xs={8}>
            {' '}
          </Grid>
          <Grid item xs={4}>
            <CalenderCustom value={dateRange} onChange={setDateRange} />
          </Grid>
        </Grid>

        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 600,
            overflow: 'auto',
          }}
        >
          <Table
            stickyHeader
            sx={{
              borderCollapse: 'collapse',
              '& td, & th': {
                border: '1px solid black',
                textAlign: 'center',
                verticalAlign: 'middle',
                fontSize: 16,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Mã hàng</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>ĐVT</TableCell>
                <TableCell>Đơn giá</TableCell>
                <TableCell>Giảm giá</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Ghi chú hàng hoá</TableCell>
                <TableCell>Cảnh báo</TableCell>
                <TableCell>Tồn cuối</TableCell>
                <TableCell>SL kho đặt</TableCell>
                <TableCell>SL tồn tối ưu</TableCell>
                <TableCell>SL có thể đặt</TableCell>
                <TableCell>SL bán kỳ gần nhất</TableCell>
                <TableCell>SL nhập NCC kỳ gần nhất</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>{item.maHang}</TableCell>

                  <TableCell sx={{ textAlign: 'left' }}>{item.tenSp}</TableCell>

                  <TableCell>{item.dvt}</TableCell>

                  <TableCell>{Number(item.donGia).toLocaleString('vi-VN')}</TableCell>

                  <TableCell>
                    <TextField
                      variant="standard"
                      value={item.giamGia || ''}
                      onChange={(e) => handleChange(index, 'giamGia', Number(e.target.value))}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          padding: '4px',
                          textAlign: 'center',
                        },
                      }}
                    />
                  </TableCell>

                  <TableCell>{item.soLuong}</TableCell>

                  <TableCell>
                    <TextField
                      variant="standard"
                      multiline
                      InputProps={{ disableUnderline: true }}
                      value={item.ghiChuHangHoa || ''}
                      onChange={(e) => handleChange(index, 'ghiChuHangHoa', e.target.value)}
                    />
                  </TableCell>

                  <TableCell>{item.canhBao}</TableCell>
                  <TableCell>{item.tonCuoi}</TableCell>
                  <TableCell>{item.slKhoDat}</TableCell>
                  <TableCell>{item.slTonToiUu}</TableCell>
                  <TableCell>{item.slCoTheDat}</TableCell>
                  <TableCell>{item.slBanCuoi}</TableCell>
                  <TableCell>{item.slNhapNccCuoi}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleClose}>
          Huỷ
        </Button>
        <Button color="primary" variant="contained" onClick={handleUpdate}  disabled={!dateRange.fromDate || !dateRange.toDate}>
          Cập nhật
        </Button>
      </DialogActions>
    </>
  );
}
