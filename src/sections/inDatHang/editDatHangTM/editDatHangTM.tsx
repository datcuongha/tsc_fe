import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Paper,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  DialogActions,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { editDatHangTM } from 'src/apis/datHang';

import { showAlert } from 'src/components/alert';

import type { EditDatHangTMProps } from './type';

export function EditDatHangTM({ data, handleClose }: EditDatHangTMProps) {
  const queryClient = useQueryClient();
  const [rows, setRows] = useState(data.detailPhieuDeXuat);
  const [page, setPage] = useState(0);
  const rowsPerPage = 50;
  const [search, setSearch] = useState({
    ncc: '',
    chiNhanh: '',
    maHang: '',
    tenHang: '',
  });
  console.log(data);

  const filteredData = rows.filter(
    (row) =>
      (row['tenNhaCungCap'] || '').toString().toLowerCase().includes(search.ncc.toLowerCase()) &&
      (row['chiNhanh'] || '').toString().toLowerCase().includes(search.chiNhanh.toLowerCase()) &&
      (row['maHang'] || '').toString().toLowerCase().includes(search.maHang.toLowerCase()) &&
      (row['tenHang'] || '').toString().toLowerCase().includes(search.tenHang.toLowerCase())
  );

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const editMutation = useMutation({
    mutationFn: editDatHangTM,
    onSuccess: () => {
      showAlert({
        type: 'success',
        message: 'Cập nhật thành công',
      });
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ['dataDH'],
      });
    },
    onError: (error: any) => {
      showAlert({
        type: 'error',
        message: error?.message || 'Cập nhật thất bại',
      });
    },
  });

  const handleEdit = () => {
    editMutation.mutate({
      maPhieuId: data.id,
      details: rows.map((item) => ({
        ...item,
        thuMuaNhap: Number(item.thuMuaNhap || 0),
      })),
    });
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 650, mt: 2 }}>
        <Table
          size="small"
          sx={{
            '& .MuiTableCell-root': {
              py: 0.5,
              fontSize: 12,
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                position: 'sticky',
                top: 0,
                backgroundColor: '#fff',
                zIndex: 11,
              }}
            >
              <TableCell>NCC</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Chi nhánh</TableCell>
              <TableCell>Mã hàng</TableCell>
              <TableCell>Tên hàng</TableCell>
              <TableCell>Ghi chú hàng hoá</TableCell>
              <TableCell>Giá vốn</TableCell>
              <TableCell>Giá bán</TableCell>
              <TableCell>SL kho đặt</TableCell>
              <TableCell>Nhập chuyển</TableCell>
              <TableCell>Xuất bán</TableCell>
              <TableCell>Tồn cuối</TableCell>
              <TableCell>SL thu mua đề xuất</TableCell>
              <TableCell>Cảnh báo</TableCell>
            </TableRow>

            <TableRow
              sx={{
                position: 'sticky',
                top: 55,
                backgroundColor: '#fff',
                zIndex: 10,
              }}
            >
              <TableCell>
                <TextField
                  size="small"
                  placeholder="Tìm NCC"
                  value={search.ncc}
                  onChange={(e) => setSearch({ ...search, ncc: e.target.value })}
                />
              </TableCell>

              <TableCell>
                <TextField
                  size="small"
                  placeholder="Tìm kho"
                  value={search.chiNhanh}
                  onChange={(e) =>
                    setSearch({
                      ...search,
                      chiNhanh: e.target.value,
                    })
                  }
                />
              </TableCell>

              <TableCell>
                <TextField
                  size="small"
                  placeholder="Tìm mã"
                  value={search.maHang}
                  onChange={(e) =>
                    setSearch({
                      ...search,
                      maHang: e.target.value,
                    })
                  }
                />
              </TableCell>

              <TableCell>
                <TextField
                  size="small"
                  placeholder="Tìm tên hàng"
                  value={search.tenHang}
                  onChange={(e) =>
                    setSearch({
                      ...search,
                      tenHang: e.target.value,
                    })
                  }
                />
              </TableCell>

              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={`${row['chiNhanh']}-${row['maHang']}-${row['tenHang']}`}>
                <TableCell>{row['tenNhaCungCap']}</TableCell>
                <TableCell>
                  {row['ngayKhoDat'] ? new Date(row['ngayKhoDat']).toLocaleDateString('vi-VN') : ''}
                </TableCell>
                <TableCell>{row['chiNhanh']}</TableCell>
                <TableCell>{row['maHang']}</TableCell>
                <TableCell>{row['tenHang']}</TableCell>
                <TableCell>{row['ghiChu']}</TableCell>
                <TableCell>{row['giaVon']}</TableCell>
                <TableCell>{row['giaBan']}</TableCell>
                <TableCell>{row['slKhoDat']}</TableCell>
                <TableCell>{row['nhapChuyen']}</TableCell>
                <TableCell>{row['xuatBan']}</TableCell>
                <TableCell>{row['tonCuoi']}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={row.thuMuaNhap ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;

                      setRows((prev) =>
                        prev.map((item) =>
                          item.maHang === row.maHang &&
                          item.chiNhanh === row.chiNhanh &&
                          item.tenHang === row.tenHang &&
                          item.ngayKhoDat === row.ngayKhoDat
                            ? {
                                ...item,
                                thuMuaNhap: value === '' ? '' : Number(value),
                              }
                            : item
                        )
                      );
                    }}
                  />
                </TableCell>
                <TableCell>{row['canhBao']}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[50]}
        onPageChange={(event, newPage) => setPage(newPage)}
      />

      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Quay lại
        </Button>
        <Button variant="contained" onClick={handleEdit} disabled={editMutation.isPending}>
          {editMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
      </DialogActions>
    </>
  );
}
