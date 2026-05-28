import { useState } from 'react';

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
  CircularProgress,
} from '@mui/material';

import { processTotal } from 'src/apis/datHang';

import { showAlert } from 'src/components/alert';
import { ButtonGroup } from 'src/components/button';
import { handleExportData } from 'src/components/export';
import { headLabelDatHang1 } from 'src/components/Item/item';

import type { Props } from './type';

export function TongHop({ data, setData, handleClose, userId }: Props) {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 50;
  const [search, setSearch] = useState({
    ncc: '',
    chiNhanh: '',
    maHang: '',
    tenHang: '',
  });

  const filteredData = data.filter(
    (row) =>
      (row['Tên nhà cung cấp'] || '').toString().toLowerCase().includes(search.ncc.toLowerCase()) &&
      (row['Chi nhánh'] || '').toString().toLowerCase().includes(search.chiNhanh.toLowerCase()) &&
      (row['Mã hàng'] || '').toString().toLowerCase().includes(search.maHang.toLowerCase()) &&
      (row['Tên hàng'] || '').toString().toLowerCase().includes(search.tenHang.toLowerCase())
  );

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleCreate = async () => {
    try {
      setLoading(true);
      const result = await processTotal(filteredData, userId);

      if (result) {
        showAlert({
          type: 'success',
          message: 'Lưu thành công',
        });
        handleClose();
      }
    } catch (error) {
      showAlert({
        type: 'error',
        message: 'Lưu thất bại',
      });
    } finally {
      setLoading(false);
    }
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

              <TableCell />

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
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow
                key={`${row['Chi nhánh']}-${row['Mã hàng']}-${row['Tên hàng']}-${page}-${index}`}
              >
                <TableCell>{row['Tên nhà cung cấp']}</TableCell>
                <TableCell>
                  {row['Thời gian'] ? new Date(row['Thời gian']).toLocaleDateString('vi-VN') : ''}
                </TableCell>
                <TableCell>{row['Chi nhánh']}</TableCell>
                <TableCell>{row['Mã hàng']}</TableCell>
                <TableCell>{row['Tên hàng']}</TableCell>
                <TableCell
                  sx={{
                    width: 100,
                    minWidth: 100,
                    maxWidth: 100,
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  {row['Ghi chú hàng hóa']}
                </TableCell>
                <TableCell>{row['Giá vốn']}</TableCell>
                <TableCell>{row['Giá bán']}</TableCell>
                <TableCell>{row['Số lượng kho đặt']}</TableCell>
                <TableCell>{row['Nhập chuyển']}</TableCell>
                <TableCell>{row['Xuất bán']}</TableCell>
                <TableCell>{row['Tồn cuối kì']}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    sx={{
                      '& .MuiInputBase-root': {
                        height: 32,
                      },
                    }}
                    inputProps={{ min: 1 }}
                    value={row.thuMuaNhap ?? ''}
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e') {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value !== '' && Number(value) < 0) return;

                      const updated = data.map((item) =>
                        item['Mã hàng'] === row['Mã hàng'] &&
                        item['Chi nhánh'] === row['Chi nhánh'] &&
                        item['Tên hàng'] === row['Tên hàng'] &&
                        item['Thời gian'] === row['Thời gian']
                          ? {
                              ...item,
                              thuMuaNhap: value === '' ? '' : Number(value),
                            }
                          : item
                      );

                      setData(updated);
                    }}
                  />
                </TableCell>
                <TableCell>{row['Cảnh báo']}</TableCell>
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
        <Button variant="contained" onClick={handleCreate} disabled={loading}>
          {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
          {loading ? 'Đang lưu...' : 'Tạo'}
        </Button>

        <ButtonGroup
          handleExport={() => {
            handleExportData({
              data: filteredData,
              fileName: 'Danh sách đơn hàng',
              columns: headLabelDatHang1,
            });
          }}
        />
      </DialogActions>
    </>
  );
}
