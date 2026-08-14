import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Add } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Paper,
  Table,
  Button,
  Tooltip,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  IconButton,
  DialogActions,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { editDatHangTM } from 'src/apis/datHang';
import { getAllKho, getDmhhByMaHang } from 'src/apis/danhMuc';

import { showAlert } from 'src/components/alert';
import { ButtonGroup } from 'src/components/button';
import { handleExportData } from 'src/components/export';

import type { EditDatHangTMProps } from './type';

export function EditDatHangTM({ data, handleClose }: EditDatHangTMProps) {
  console.log(data);

  const queryClient = useQueryClient();
  const thuMuaRefs = useRef<(HTMLInputElement | null)[]>([]);
  const chuThichRefs = useRef<(HTMLInputElement | null)[]>([]);
  const maHangRef = useRef<(HTMLInputElement | null)[]>([]);
  const [rows, setRows] = useState(
    [...data.phieuDeXuatDetail].sort((a, b) => a.chiNhanh.localeCompare(b.chiNhanh))
  );
  const [page, setPage] = useState(0);
  const rowsPerPage = 50;
  const [search, setSearch] = useState({
    ncc: '',
    chiNhanh: '',
    maHang: '',
    tenHang: '',
  });

  const filteredData = rows.filter(
    (row) =>
      (row['tenNhaCungCap'] || '').toString().toLowerCase().includes(search.ncc.toLowerCase()) &&
      (row['chiNhanh'] || '').toString().toLowerCase().includes(search.chiNhanh.toLowerCase()) &&
      (row['maHang'] || '').toString().toLowerCase().includes(search.maHang.toLowerCase()) &&
      (row['tenHang'] || '').toString().toLowerCase().includes(search.tenHang.toLowerCase())
  );

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const { data: dataKho = [] } = useQuery({
    queryKey: ['dmKho'],
    queryFn: getAllKho,
  });

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
      phieuId: data.id,
      details: rows.map((item) => ({
        ...item,
        thuMuaNhap: Number(item.thuMuaNhap || 0),
      })),
    });
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        isNew: true,
        id: Date.now(),
        phieuId: data.id,
        chiNhanh: '',
        maHang: '',
        tenNhaCungCap: '',
        dvt: '',
        tenHang: '',
        nhapChuyen: 0,
        xuatBan: 0,
        tonCuoi: 0,
        slKhoDat: 0,
        giaVon: 0,
        giaBan: 0,
        canhBao: '',
        ghiChu: '',
        thuMuaNhap: '',
        ngayKhoDat: '',
        chuThich: '',
      },
    ]);
  };

  const handleDeleteRow = (row: any) => {
    setRows((prev) => prev.filter((item) => item !== row));
  };

  const branchOptions = [...new Set(dataKho.map((x: any) => x.tenKho))] as string[];

  const handleSelectMaHang = async (rowId: number, maHang: string) => {
    const row = rows.find((x) => x.id === rowId);
    if (!row) return;

    // Kiểm tra đã tồn tại cùng kho + mã hàng chưa
    const isDuplicate = rows.some(
      (item) => item.id !== rowId && item.chiNhanh === row.chiNhanh && item.maHang === maHang
    );

    if (isDuplicate) {
      showAlert({
        type: 'error',
        message: `Mã hàng ${maHang} đã tồn tại trong kho ${row.chiNhanh}.`,
      });
      return;
    }

    const code = maHang.trim().toUpperCase();
    try {
      const productName = await getDmhhByMaHang(code);
      const product = data?.xntDetail.find(
        (x) => x.chiNhanh === row.chiNhanh && x.maHang?.trim().toUpperCase() === code
      );

      // Tìm cảnh báo NGAY khi paste mã
      const phieuDetail = data?.phieuDatHangDetail?.find(
        (x) => x.maHang?.trim().toUpperCase() === code
      );

      const canhBao =
        phieuDetail !== undefined ? (phieuDetail.canhBao ?? '') : 'SKU chưa có trong định mức';

      if (!productName) {
        showAlert({
          type: 'error',
          message: 'Không tìm thấy mã hàng',
        });
        setRows((prev) =>
          prev.map((item) =>
            item.id === rowId
              ? {
                  ...item,
                  maHang: code,
                  canhBao,
                }
              : item
          )
        );

        return;
      }

      setRows((prev) =>
        prev.map((item) =>
          item.id === rowId
            ? {
                ...item,
                maHang,
                tenHang: productName.tenHang,
                giaBan: productName.giaBan,
                giaVon: productName.giaMua,
                dvt: productName.dvt,
                thueSuat: productName.vat,
                tenNhaCungCap: product?.tenNhaCungCap ?? productName.dmncc?.tenNcc ?? '',
                nhapChuyen: product?.nhapChuyen ?? 0,
                xuatBan: product?.xuatBan ?? 0,
                tonCuoi: product?.tonCuoi ?? 0,

                canhBao,
              }
            : item
        )
      );
    } catch {
      showAlert({
        type: 'error',
        message: 'Không thể tìm thông tin mã hàng',
      });
    }
  };

  return (
    <>
      <div style={{ textAlign: 'right', fontWeight: 'bold', margin: 5 }}>Phiếu {data.maPhieu}</div>
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
              <TableCell sx={{ width: 100 }}>NCC</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell sx={{ width: 70 }}>Chi nhánh</TableCell>
              <TableCell sx={{ width: 180 }}>Mã hàng</TableCell>
              <TableCell sx={{ width: 120 }}>Tên hàng</TableCell>
              <TableCell sx={{ width: 70 }}>Ghi chú hàng hoá</TableCell>
              <TableCell sx={{ width: 30 }}>SL kho đặt</TableCell>
              <TableCell sx={{ width: 30 }}>Giá vốn</TableCell>
              <TableCell sx={{ width: 30 }}>Giá bán</TableCell>
              <TableCell sx={{ width: 30 }}>Nhập chuyển</TableCell>
              <TableCell sx={{ width: 30 }}>Xuất bán</TableCell>
              <TableCell sx={{ width: 30 }}>Tồn cuối</TableCell>
              <TableCell sx={{ width: 90 }}>SL thu mua đề xuất</TableCell>
              <TableCell sx={{ width: 50 }}>Cảnh báo</TableCell>
              <TableCell sx={{ width: 120 }}>Chú thích</TableCell>
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
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row, index) => {
              const xntRows = data.xntDetail.filter((item) => item['maHang'] === row['maHang']);

              return (
                <TableRow
                  key={`${row['chiNhanh']}-${row['maHang']}-${row['tenHang']}-${page}-${index}`}
                >
                  <TableCell>{row['tenNhaCungCap']}</TableCell>
                  <TableCell>
                    {row['ngayKhoDat']
                      ? new Date(row['ngayKhoDat']).toLocaleDateString('vi-VN')
                      : ''}
                  </TableCell>

                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={row['chiNhanh'] ?? ''}
                      disabled={!row.isNew}
                      onChange={(e) => {
                        const value = e.target.value;

                        setRows((prev) =>
                          prev.map((item) =>
                            item.id === row.id
                              ? {
                                  ...item,
                                  chiNhanh: value,
                                  maHang: '',
                                  tenHang: '',
                                }
                              : item
                          )
                        );
                      }}
                      fullWidth
                    >
                      {branchOptions.map((branch) => (
                        <MenuItem key={branch} value={branch}>
                          {branch}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        width: '100%',
                      }}
                    >
                      <TextField
                        sx={{ flex: 1 }}
                        size="small"
                        value={row.maHang ?? ''}
                        disabled={!row.chiNhanh || !row.isNew}
                        inputRef={(el) => {
                          maHangRef.current[index] = el;
                        }}
                        onChange={(e) => {
                          const value = e.target.value;

                          // Chỉ cập nhật state, KHÔNG gọi API ở đây
                          setRows((prev) =>
                            prev.map((item) =>
                              item.id === row.id
                                ? {
                                    ...item,
                                    maHang: value,
                                  }
                                : item
                            )
                          );
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();

                            // Lấy từ row.maHang thay vì e.currentTarget.value
                            const value = (row.maHang ?? '').trim().toUpperCase();

                            if (value) {
                              handleSelectMaHang(row.id, value);
                            }

                            // Chuyển xuống ô mã hàng tiếp theo
                            const nextInput = maHangRef.current[index + 1];

                            setTimeout(() => {
                              nextInput?.focus();
                            }, 0);
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();

                          const value = e.clipboardData.getData('text').trim().toUpperCase();

                          if (!value) return;

                          // Cập nhật mã ngay lập tức để không bị mất giá trị paste
                          setRows((prev) =>
                            prev.map((item) =>
                              item.id === row.id
                                ? {
                                    ...item,
                                    maHang: value,
                                  }
                                : item
                            )
                          );

                          // Sau đó mới tìm thông tin mã hàng
                          handleSelectMaHang(row.id, value);
                        }}
                      />

                      <Tooltip
                        arrow
                        placement="right"
                        title={
                          <Box sx={{ minWidth: 280 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                fontWeight: 'bold',
                                borderBottom: '1px solid #666',
                                pb: 0.5,
                                mb: 0.5,
                              }}
                            >
                              <Box sx={{ flex: 2 }}>Kho</Box>
                              <Box sx={{ flex: 1, textAlign: 'center' }}>Nhập chuyển</Box>
                              <Box sx={{ flex: 1, textAlign: 'center' }}>Xuất bán</Box>
                              <Box sx={{ flex: 1, textAlign: 'center' }}>Tồn cuối</Box>
                            </Box>

                            {xntRows.map((item, indexXnt) => (
                              <Box
                                key={indexXnt}
                                sx={{
                                  display: 'flex',
                                  py: 0.5,
                                }}
                              >
                                <Box sx={{ flex: 2 }}>{item['chiNhanh']}</Box>
                                <Box sx={{ flex: 1, textAlign: 'center' }}>
                                  {item['nhapChuyen']}
                                </Box>
                                <Box sx={{ flex: 1, textAlign: 'center' }}>{item['xuatBan']}</Box>
                                <Box sx={{ flex: 1, textAlign: 'center' }}>{item['tonCuoi']}</Box>
                              </Box>
                            ))}
                          </Box>
                        }
                      >
                        <InfoIcon
                          fontSize="small"
                          color="warning"
                          sx={{ ml: 0.5, cursor: 'pointer' }}
                        />
                      </Tooltip>
                    </Box>
                  </TableCell>

                  <TableCell>{row['tenHang']}</TableCell>
                  <TableCell>{row['ghiChu']}</TableCell>
                  <TableCell>{row['slKhoDat']}</TableCell>
                  <TableCell>{row['giaVon'].toLocaleString('vi-VN')}</TableCell>
                  <TableCell>{row['giaBan'].toLocaleString('vi-VN')}</TableCell>
                  <TableCell>{row['nhapChuyen']}</TableCell>
                  <TableCell>{row['xuatBan']}</TableCell>
                  <TableCell>{row['tonCuoi']}</TableCell>

                  <TableCell>
                    <TextField
                      inputRef={(el) => {
                        thuMuaRefs.current[index] = el;
                      }}
                      inputProps={{
                        min: 0,
                      }}
                      size="small"
                      type="number"
                      value={row.thuMuaNhap ?? ''}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();

                          const nextInput = thuMuaRefs.current[index + 1];
                          nextInput?.focus();
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;
                        setRows((prev) =>
                          prev.map((item) =>
                            item.id === row.id
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

                  <TableCell>{row.canhBao}</TableCell>

                  <TableCell>
                    <TextField
                      inputRef={(el) => {
                        chuThichRefs.current[index] = el;
                      }}
                      size="small"
                      value={row.chuThich ?? ''}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();

                          const nextInput = chuThichRefs.current[index + 1];
                          nextInput?.focus();
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;
                        setRows((prev) =>
                          prev.map((item) =>
                            item.id === row.id
                              ? {
                                  ...item,
                                  chuThich: value === '' ? '' : value,
                                }
                              : item
                          )
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {row.ghiChu === '' && (
                      <IconButton color="error" size="small" onClick={() => handleDeleteRow(row)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
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
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddRow}
          disabled={['DA_DUYET', 'CHO_DUYET', 'TRA_LAI'].includes(data.trangThai)}
        >
          Thêm
        </Button>

        <Button
          variant="contained"
          onClick={handleEdit}
          disabled={['DA_DUYET', 'CHO_DUYET', 'TRA_LAI'].includes(data.trangThai)}
        >
          {editMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
        <ButtonGroup
          handleExport={() => {
            handleExportData({
              data: filteredData,
              fileName: `Phiếu ${data.maPhieu.replace(/\//g, '-')}`,
              columns: [
                { id: 'tenNhaCungCap', label: 'NCC' },
                { id: 'chiNhanh', label: 'Kho' },
                { id: 'maHang', label: 'Mã hàng' },
                { id: 'tenHang', label: 'Tên hàng' },
                { id: 'ghiChu', label: 'Ghi chú hàng hoá' },
                { id: 'thuMuaNhap', label: 'Số lượng đặt hàng' },
                { id: 'chuThich', label: 'Chú thích' },
              ],
            });
          }}
        />
      </DialogActions>
    </>
  );
}
