import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

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

import { processTotal } from 'src/apis/datHang';
import { getAllKho, getAllDmhh } from 'src/apis/danhMuc';

import { showAlert } from 'src/components/alert';
import { LoadingBackdrop } from 'src/components/loading';

import type { Props } from './type';

export function TongHop({
  pivot,
  pivotXnt,
  setData,
  handleClose,
  userId,
  hasDuplicate,
  duplicates,
}: Props) {
  const thuMuaRefs = useRef<(HTMLInputElement | null)[]>([]);
  const chuThichRefs = useRef<(HTMLInputElement | null)[]>([]);
  const maHangRef = useRef<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 50;
  const [search, setSearch] = useState({
    ncc: '',
    chiNhanh: '',
    maHang: '',
    tenHang: '',
  });

  const { data: dataDmhh = [] } = useQuery({
    queryKey: ['dataDmhh'],
    queryFn: getAllDmhh,
  });

  const { data: dataKho = [] } = useQuery({
    queryKey: ['dmKho'],
    queryFn: getAllKho,
  });

  const filteredData = pivot.filter((row) => {
    if (row.isNew) return true;

    return (
      (row['Tên nhà cung cấp'] || '').toString().toLowerCase().includes(search.ncc.toLowerCase()) &&
      (row['Chi nhánh'] || '').toString().toLowerCase().includes(search.chiNhanh.toLowerCase()) &&
      (row['Mã hàng'] || '').toString().toLowerCase().includes(search.maHang.toLowerCase()) &&
      (row['Tên hàng'] || '').toString().toLowerCase().includes(search.tenHang.toLowerCase())
    );
  });
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const fromDate = new Date(pivot[0]?.fromDate).toLocaleDateString('vi-VN');
  const toDate = new Date(pivot[0]?.toDate).toLocaleDateString('vi-VN');

  const handleAddRow = () => {
    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        pivot: [
          ...prev.pivot,
          {
            isNew: true,
            'Chi nhánh': '',
            'Mã hàng': '',
            'Tên hàng': '',
            'SL kho đặt': 0,
            'Giá vốn': 0,
            'Giá bán': 0,
            'Thu mua nhập': 0,
            'Cảnh báo': '',
            'Ghi chú': '',
            chuThich: '',
          },
        ],
      };
    });
  };

  const handleDeleteRow = (row: any) => {
    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        pivot: prev.pivot.filter((item) => item !== row),
      };
    });
  };

  // const branchOptions = [...new Set(pivotXnt.map((x) => x['Chi nhánh']))];
  const branchOptions = [...new Set(dataKho.map((x: any) => x.tenKho))] as string[];

  const handleSelectMaHang = (row: any, maHang: string) => {
    const isDuplicate = pivot.some(
      (item) => item !== row && item['Chi nhánh'] === row['Chi nhánh'] && item['Mã hàng'] === maHang
    );

    if (isDuplicate) {
      showAlert({
        type: 'error',
        message: `Mã hàng ${maHang} đã tồn tại trong kho ${row['Chi nhánh']}.`,
      });
      return;
    }
    const code = maHang.trim().toUpperCase();

    const productDmhh = dataDmhh.find((x: any) => x.maHang?.trim().toUpperCase() === code);

    const product = pivotXnt.find(
      (x) => x['Chi nhánh'] === row['Chi nhánh'] && x['Mã hàng'].trim().toUpperCase() === code
    );

    // const product = pivotXnt.find(
    //   (x) => x['Chi nhánh'] === row['Chi nhánh'] && x['Mã hàng'] === maHang
    // );

    // const productDmhh = dataDmhh.find((x: any) => x.maHang === maHang);

    // const ncc = dataNcc.find((x: any) => x.maNcc === productDmhh?.maNcc);

    if (!product && !productDmhh) {
      showAlert({
        type: 'error',
        message: 'Không tìm thấy mã hàng',
      });
      return;
    }

    const updated = pivot.map((item) =>
      item === row
        ? {
            ...item,
            ['Mã hàng']: maHang,
            ['Tên hàng']: productDmhh?.tenHang ?? '',
            ['Giá bán']: productDmhh?.giaBan ?? 0,
            ['Giá vốn']: productDmhh?.giaMua ?? 0,
            ['ĐVT']: productDmhh?.dvt ?? '',
            ['Mức thuế VAT đầu vào']: productDmhh?.vat ?? 0,
            // Nếu có trong pivotXnt thì lấy thương hiệu, không thì lấy từ dmhh (nếu có)
            ['Tên nhà cung cấp']: product?.['Thương hiệu'] ?? productDmhh?.dmncc?.tenNcc ?? '',

            // Nếu không có trong pivotXnt thì mặc định 0
            ['Nhập chuyển']: product?.['Nhập chuyển'] ?? null,
            ['Xuất bán']: product?.['Xuất bán'] ?? null,
            ['Tồn cuối kì']: product?.['Tồn cuối kì'] ?? null,
            ['Cảnh báo']: product?.['Cảnh báo'] ?? 'SKU chưa có trong định mức',
          }
        : item
    );

    setData((prev) => ({
      ...prev!,
      pivot: updated,
    }));
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const result = await processTotal({
        filteredData,
        pivotXnt,
        userId,
        fromDate: pivot[0]?.fromDate,
        toDate: pivot[0]?.toDate,
      });

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
        message: String(error),
      });
    } finally {
      setLoading(false);
    }
  };
  const latestDuplicates = Object.values(
    duplicates.reduce(
      (acc, item) => {
        const key = item.phieuDatHangNhap; // hoặc item.maPhieu.replace(/\.\d+$/, '') nếu muốn nhóm theo mã gốc

        if (
          !acc[key] ||
          item.maPhieu.localeCompare(acc[key].maPhieu, undefined, { numeric: true }) > 0
        ) {
          acc[key] = item;
        }

        return acc;
      },
      {} as Record<string, (typeof duplicates)[number]>
    )
  );
  const groupedDuplicates = latestDuplicates.reduce(
    (acc, item) => {
      if (!acc[item.maPhieu]) {
        acc[item.maPhieu] = {
          tenNcc: item.tenNcc,
          phieuDatHangNhap: [],
        };
      }

      acc[item.maPhieu].phieuDatHangNhap.push(item.phieuDatHangNhap);

      return acc;
    },
    {} as Record<
      string,
      {
        tenNcc: string;
        phieuDatHangNhap: string[];
      }
    >
  );
  return (
    <>
      <div style={{ textAlign: 'right', fontWeight: 'bold', margin: 5 }}>
        Kỳ số liệu: Từ {fromDate} - {toDate}
      </div>
      {hasDuplicate && (
        <div
          style={{
            marginTop: 3,
            marginBottom: 7,
            padding: '10px 12px',
            border: '1px solid #f5c2c7',
            background: '#fff3cd',
            borderRadius: 6,
            color: '#856404',
            fontSize: 14,
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
            ⚠️ Các phiếu đặt hàng đã tồn tại:
          </div>

          {Object.entries(groupedDuplicates).map(([maPhieu, info]) => (
            <div key={maPhieu}>
              • <b>{maPhieu}</b> - <b>{info.tenNcc}</b>: {info.phieuDatHangNhap.join(', ')}
            </div>
          ))}
        </div>
      )}
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
              <TableCell sx={{ width: 30 }}>Giá vốn</TableCell>
              <TableCell sx={{ width: 30 }}>Giá bán</TableCell>
              <TableCell sx={{ width: 30 }}>SL kho đặt</TableCell>
              <TableCell sx={{ width: 30 }}>Nhập chuyển</TableCell>
              <TableCell sx={{ width: 30 }}>Xuất bán</TableCell>
              <TableCell sx={{ width: 30 }}>Tồn cuối</TableCell>
              <TableCell sx={{ width: 90 }}>SL thu mua đề xuất</TableCell>
              <TableCell sx={{ width: 50 }}>Cảnh báo</TableCell>
              <TableCell sx={{ width: 120 }}>Chú thích</TableCell>

              <TableCell />
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
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row, index) => {
              const xntRows = pivotXnt.filter((item) => item['Mã hàng'] === row['Mã hàng']);
              return (
                <TableRow
                  key={`${row['Chi nhánh']}-${row['Mã hàng']}-${row['Tên hàng']}-${page}-${index}`}
                >
                  <TableCell>{row['Tên nhà cung cấp']}</TableCell>

                  <TableCell>
                    {row['Thời gian'] ? new Date(row['Thời gian']).toLocaleDateString('vi-VN') : ''}
                  </TableCell>

                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={row['Chi nhánh'] ?? ''}
                      disabled={!row.isNew}
                      onChange={(e) => {
                        const value = e.target.value;

                        const updated = pivot.map((item) =>
                          item === row
                            ? {
                                ...item,
                                ['Chi nhánh']: value,
                                ['Mã hàng']: '',
                                ['Tên hàng']: '',
                              }
                            : item
                        );

                        setData((prev) => ({
                          ...prev!,
                          pivot: updated,
                        }));
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
                      {/* <TextField
                        sx={{ flex: 1 }}
                        size="small"
                        value={row['Mã hàng'] ?? ''}
                        disabled={!row['Chi nhánh']}
                        onChange={(e) => {
                          const value = e.target.value;

                          const updated = pivot.map((item) =>
                            item['Chi nhánh'] === row['Chi nhánh'] &&
                            item['Tên hàng'] === row['Tên hàng'] &&
                             item['Thời gian'] === row['Thời gian']
                              ? {
                                  ...item,
                                  ['Mã hàng']: value,
                                }
                              : item
                          );

                          setData((prev) => ({
                            ...prev!,
                            pivot: updated,
                          }));
                        }}
                        onPaste={(e) => {
                          const value = e.clipboardData.getData('text');

                          setTimeout(() => {
                            handleSelectMaHang(row, value);
                          }, 0);
                        }}
                      /> */}
                      <TextField
                        size="small"
                        defaultValue={row['Mã hàng'] ?? ''}
                        disabled={!row['Chi nhánh'] || !row.isNew}
                        onChange={(e) => {
                          maHangRef.current[index] = e.target.value.toUpperCase();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();

                            const value = maHangRef.current[index] ?? '';

                            const updated = pivot.map((item) =>
                              item === row
                                ? {
                                    ...item,
                                    ['Mã hàng']: value,
                                  }
                                : item
                            );

                            setData((prev) => ({
                              ...prev!,
                              pivot: updated,
                            }));

                            handleSelectMaHang(row, value);

                            thuMuaRefs.current[index + 1]?.focus();
                          }
                        }}
                        onBlur={() => {
                          const value = maHangRef.current[index] ?? '';

                          const updated = pivot.map((item) =>
                            item === row
                              ? {
                                  ...item,
                                  ['Mã hàng']: value,
                                }
                              : item
                          );

                          setData((prev) => ({
                            ...prev!,
                            pivot: updated,
                          }));

                          handleSelectMaHang(row, value);
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
                                <Box sx={{ flex: 2 }}>{item['Chi nhánh']}</Box>
                                <Box sx={{ flex: 1, textAlign: 'center' }}>
                                  {item['Nhập chuyển']}
                                </Box>
                                <Box sx={{ flex: 1, textAlign: 'center' }}>{item['Xuất bán']}</Box>
                                <Box sx={{ flex: 1, textAlign: 'center' }}>
                                  {item['Tồn cuối kì']}
                                </Box>
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

                  <TableCell sx={{ textAlign: 'right' }}>
                    {row['Giá vốn'].toLocaleString('vi-VN')}
                  </TableCell>

                  <TableCell sx={{ textAlign: 'right' }}>
                    {row['Giá bán'].toLocaleString('vi-VN')}
                  </TableCell>

                  <TableCell>{row['Số lượng kho đặt']}</TableCell>

                  <TableCell>{row['Nhập chuyển']}</TableCell>

                  <TableCell>{row['Xuất bán']}</TableCell>

                  <TableCell>{row['Tồn cuối kì']}</TableCell>

                  <TableCell>
                    <TextField
                      inputRef={(el) => {
                        thuMuaRefs.current[index] = el;
                      }}
                      size="small"
                      type="number"
                      value={row.thuMuaNhap ?? ''}
                      inputProps={{
                        min: 0,
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();

                          const nextInput = thuMuaRefs.current[index + 1];
                          nextInput?.focus();
                        }

                        if (e.key === '-' || e.key === 'e') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;

                        const updated = pivot.map((item) =>
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

                        setData((prev) => ({
                          ...prev,
                          pivot: updated,
                        }));
                      }}
                    />
                  </TableCell>

                  <TableCell>{row['Cảnh báo']}</TableCell>

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

                        if (e.key === '-') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;

                        const updated = pivot.map((item) =>
                          item['Mã hàng'] === row['Mã hàng'] &&
                          item['Chi nhánh'] === row['Chi nhánh'] &&
                          item['Tên hàng'] === row['Tên hàng'] &&
                          item['Thời gian'] === row['Thời gian']
                            ? {
                                ...item,
                                chuThich: value === '' ? '' : value,
                              }
                            : item
                        );

                        setData((prev) => ({
                          ...prev,
                          pivot: updated,
                        }));
                      }}
                    />
                    {/* <TextField
                      size="small"
                      defaultValue={row.chuThich ?? ''}
                      onChange={(e) => {
                        chuThichRefs.current[row['Mã hàng']] = e.target.value;
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                        }
                      }}
                      onBlur={() => {
                        const value = chuThichRefs.current[row['Mã hàng']];

                        const updated = pivot.map((item) =>
                          item['Mã hàng'] === row['Mã hàng'] &&
                          item['Chi nhánh'] === row['Chi nhánh'] &&
                          item['Tên hàng'] === row['Tên hàng'] &&
                          item['Thời gian'] === row['Thời gian']
                            ? {
                                ...item,
                                chuThich: value === '' ? '' : value,
                              }
                            : item
                        );
                        setData((prev) => ({
                          ...prev,
                          pivot: updated,
                        }));
                      }}
                    /> */}
                  </TableCell>

                  <TableCell align="center">
                    {row['SL kho đặt'] === 0 && (
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
        <Button variant="contained" startIcon={<Add />} onClick={handleAddRow} disabled={loading}>
          Thêm
        </Button>
        <Button variant="contained" onClick={handleCreate} disabled={loading}>
          Tạo
        </Button>
      </DialogActions>

      <LoadingBackdrop open={loading} message='Đang xử lý, vui lòng chờ...' />
    </>
  );
}
