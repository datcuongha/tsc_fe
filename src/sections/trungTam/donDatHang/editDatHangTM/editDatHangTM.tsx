import Swal from 'sweetalert2';
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

const normalize = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .toUpperCase();

const calculateSlCoTheDat = ({
  canhBao,
  tonCuoi,
  tonToiUu,
}: {
  canhBao: unknown;
  tonCuoi: unknown;
  tonToiUu: unknown;
}): number | string => {
  const warning = String(canhBao ?? '').trim();

  if (warning === 'Không bán được 3 tháng') {
    return 'Không bán được 3 tháng';
  }

  if (warning === 'Chưa xác định') {
    return 'Chưa xác định định mức';
  }

  if (warning === 'SKU chưa có trong định mức') {
    return 'SKU chưa có trong định mức';
  }

  const parsedTonCuoi = Number(tonCuoi);
  const parsedTonToiUu = Number(tonToiUu);

  const safeTonCuoi = Number.isFinite(parsedTonCuoi) ? parsedTonCuoi : 0;

  const safeTonToiUu = Number.isFinite(parsedTonToiUu) ? parsedTonToiUu : 0;

  if (safeTonCuoi <= safeTonToiUu) {
    return safeTonToiUu - safeTonCuoi;
  }

  return 'Vượt tồn tối ưu';
};
export function EditDatHangTM({ data, handleClose }: EditDatHangTMProps) {
  const queryClient = useQueryClient();
  const thuMuaRefs = useRef<(HTMLInputElement | null)[]>([]);
  const chuThichRefs = useRef<(HTMLInputElement | null)[]>([]);
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

    const handleBack = async () => {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Xác nhận',
        text: 'Bạn có chắc muốn quay lại không?',
        showCancelButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Huỷ',
        confirmButtonColor: '#d32f2f',
        didOpen: () => {
          const container = Swal.getContainer();
  
          if (container) {
            container.style.zIndex = '2000';
          }
        },
      });
  
      if (result.isConfirmed) {
        handleClose();
      }
    };

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
        slCoTheDat: Number(item.slCoTheDat || 0),
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
        slCoTheDat: 0,
        slTonToiUu: 0,
        soLuongPGDDuyet: 0,
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
    
    try {
      // const code = maHang.trim().toUpperCase();
      const code = normalize(maHang);

      const productName = await getDmhhByMaHang(code);

      if (!productName) {
        showAlert({
          type: 'error',
          message: 'Không tìm thấy mã hàng',
        });
        return;
      }
      // Tất cả dòng XNT cùng mã hàng
      const xntRows = data.xntDetail?.filter((item) => normalize(item.maHang) === code) ?? [];

      // Tìm dòng có tồn kho tối ưu
      const xntRow = xntRows.find(
        (item) => item.slTonToiUu !== null && item.slTonToiUu !== undefined
      );

      // Tổng tồn cuối của mã hàng ở tất cả kho
      const totalTon = xntRows.reduce((sum, item) => sum + Number(item.tonCuoi ?? 0), 0);

      // Tồn tối ưu theo mã hàng
      const tonToiUu = Number(xntRow?.slTonToiUu ?? 0);

      // Cảnh báo theo mã hàng
      const canhBao = xntRow?.canhBao ?? 'SKU chưa có trong định mức';

      // Tính giống file Tổng hợp
      const slCoTheDat: number | string = calculateSlCoTheDat({
        canhBao,
        tonCuoi: totalTon,
        tonToiUu,
      });

      // Dòng này chỉ dùng lấy nhập/xuất/tồn đúng kho
      const xntProductByBranch = data.xntDetail?.find(
        (item) =>
          normalize(item.chiNhanh) === normalize(row.chiNhanh) && normalize(item.maHang) === code
      );
      // const productByXntDetail =
      //   data.xntDetail?.filter((item) => normalize(item.maHang) === code) ?? [];

      // const totalTon = productByXntDetail.reduce((sum, item) => sum + Number(item.tonCuoi ?? 0), 0);

      // const tonToiUu = Number(productByXntDetail[0]?.slTonToiUu ?? 0);

      // const xntProductByBranch = data.xntDetail?.find(
      //   (item) =>
      //     normalize(item.chiNhanh) === normalize(row.chiNhanh) && normalize(item.maHang) === code
      // );

      // const hasXnt = productByXntDetail.length > 0;
      // const isOverStock = hasXnt && totalTon > tonToiUu;

      // // Luôn để kiểu number vì type slCoTheDat là number
      // const slCoTheDat = hasXnt ? Math.max(tonToiUu - totalTon, 0) : 0;

      // const canhBao =
      //   xntProductByBranch?.canhBao ??
      //   (!hasXnt ? 'SKU chưa có trong định mức' : isOverStock ? 'Vượt tồn tối ưu' : '');

      // const productByXntDetail = data?.xntDetail?.filter((item) => normalize(item.maHang) === code);

      // const totalTon = productByXntDetail.reduce((sum, item) => sum + Number(item.tonCuoi ?? 0), 0);

      // const tonToiUu = Number(productByXntDetail[0]?.slTonToiUu ?? 0);

      // const slCoTheDat: number | string =
      //   productByXntDetail.length === 0
      //     ? 'SKU chưa có trong định mức'
      //     : totalTon <= tonToiUu
      //       ? tonToiUu - totalTon
      //       : 'Vượt tồn tối ưu';

      // const xntProductByBranch = data?.xntDetail?.find(
      //   (x) =>
      //     x.chiNhanh?.trim() === row.chiNhanh?.trim() && x.maHang?.trim().toUpperCase() === code
      // );

      // const detailByCode = data?.phieuDatHangDetail?.find(
      //   (x) => x.maHang?.trim().toUpperCase() === code
      // );

      // const detailXNTByCode = data?.xntDetail?.find((x) => x.maHang?.trim().toUpperCase() === code);

      // const deXuatByCode = data?.phieuDeXuatDetail?.find(
      //   (x) =>
      //     x.chiNhanh?.trim() === row.chiNhanh?.trim() && x.maHang?.trim().toUpperCase() === code
      // );

      // // Tất cả dữ liệu XNT cùng mã hàng
      // const xntRows = data?.xntDetail?.filter((x) => x.maHang?.trim().toUpperCase() === code) ?? [];

      // // Cộng tồn cuối của tất cả chi nhánh
      // const totalTon = xntRows.reduce((sum, item) => sum + Number(item.tonCuoi ?? 0), 0);

      // const tonToiUuValue = detailXNTByCode?.slTonToiUu ?? detailByCode?.slTonToiUu;

      // const tonToiUu = Number(data?.xntDetail[0]?.slTonToiUu ?? 0);

      // const canhBao =
      //   detailXNTByCode?.canhBao ?? detailByCode?.canhBao ?? 'SKU chưa có trong định mức';

      // const slCoTheDat: number | string =
      //   xntRows.length === 0 || tonToiUuValue == null
      //     ? 'SKU chưa có trong định mức'
      //     : totalTon <= tonToiUu
      //       ? tonToiUu - totalTon
      //       : 'Vượt tồn tối ưu';
      // // =====================================================
      // // TÌM XNT ĐÚNG CHI NHÁNH + MÃ HÀNG
      // // =====================================================
      // const xntProduct = data?.xntDetail?.find(
      //   (x) =>
      //     x.chiNhanh?.trim() === row.chiNhanh?.trim() && x.maHang?.trim().toUpperCase() === code
      // );

      // // =====================================================
      // // TÌM DETAIL TỔNG THEO MÃ HÀNG
      // // =====================================================
      // const detailByCode = data?.phieuDatHangDetail?.find(
      //   (x) => x.maHang?.trim().toUpperCase() === code
      // );
      // const detailXNTByCode = data?.xntDetail?.find((x) => x.maHang?.trim().toUpperCase() === code);

      // // =====================================================
      // // TÌM ĐỀ XUẤT CŨ ĐÚNG CHI NHÁNH + MÃ HÀNG
      // // =====================================================
      // const deXuatByCode = data?.phieuDeXuatDetail?.find(
      //   (x) =>
      //     x.chiNhanh?.trim() === row.chiNhanh?.trim() && x.maHang?.trim().toUpperCase() === code
      // );

      // // =====================================================
      // // CẢNH BÁO
      // // =====================================================
      // const canhBao =
      //   detailXNTByCode?.canhBao ?? detailByCode?.canhBao ?? 'SKU chưa có trong định mức';

      // const slCoTheDat =
      //   detailXNTByCode?.slTonToiUu ?? detailByCode?.slTonToiUu ?? 'SKU chưa có trong định mức';

      // =====================================================
      // KIỂM TRA NCC
      // =====================================================
      const nccMaHang = productName.dmncc?.tenNcc?.trim().toLowerCase();

      const nccHienTai = data.tenNcc?.trim().toLowerCase();

      if (nccHienTai && nccMaHang && nccMaHang !== nccHienTai) {
        showAlert({
          type: 'error',
          message: `Mã hàng ${code} thuộc NCC "${productName.dmncc?.tenNcc}", không thuộc NCC "${data.tenNcc}".`,
        });

        return;
      }

      // =====================================================
      // UPDATE ROW
      // =====================================================
      // setRows((prev) =>
      //   prev.map((item) =>
      //     item.id === rowId
      //       ? {
      //           ...item,

      //           maHang: code,

      //           tenHang: productName.tenHang,

      //           giaBan: Number(productName.giaBan) || 0,

      //           giaVon: Number(productName.giaMua) || 0,

      //           dvt: productName.dvt ?? '',

      //           thueSuat: productName.vat,

      //           tenNhaCungCap: productName.dmncc?.tenNcc ?? '',

      //           // XNT đúng kho
      //           nhapChuyen: Number(xntProductByBranch?.nhapChuyen) || 0,

      //           xuatBan: Number(xntProductByBranch?.xuatBan) || 0,

      //           tonCuoi: Number(xntProductByBranch?.tonCuoi) || 0,

      //           slTonToiUu: Number(xntProductByBranch?.slTonToiUu) || 0,

      //           // định mức

      //           slCoTheDat: Number(slCoTheDat),
      //         }
      //       : item
      //   )
      // );
      setRows((prev) =>
        prev.map((item) =>
          item.id === rowId
            ? {
                ...item,
                maHang: code,
                tenHang: productName.tenHang ?? '',
                giaBan: Number(productName.giaBan) || 0,
                giaVon: Number(productName.giaMua) || 0,
                dvt: productName.dvt ?? '',
                thueSuat: productName.vat,
                tenNhaCungCap: productName.dmncc?.tenNcc ?? '',

                // Dữ liệu dòng mới lấy từ xuất nhập tồn
                nhapChuyen: Number(xntProductByBranch?.nhapChuyen) || 0,
                xuatBan: Number(xntProductByBranch?.xuatBan) || 0,
                tonCuoi: Number(xntProductByBranch?.tonCuoi) || 0,
                slTonToiUu: Number(xntProductByBranch?.slTonToiUu) || 0,

                canhBao,
                slCoTheDat,
              }
            : item
        )
      );
    } catch (error) {
      console.error('Lỗi tìm mã hàng:', error);

      showAlert({
        type: 'error',
        message: 'Không thể tìm thấy mã hàng',
      });
    }
  };

  const dates = [
    ...new Set(
      (data.phieuDeXuatDetail ?? [])
        .map((x: any) => x.ngayKhoDat)
        .filter(
          (d: any) =>
            d && d !== '0' && d !== 0 && d !== '0000-00-00' && !isNaN(new Date(d).getTime())
        )
    ),
  ].sort() as string[];

  return (
    <>
      <Box textAlign="center" mb={3}>
        <Box fontSize={24} fontWeight="bold">
          CẬP NHẬT PHIẾU ĐỀ XUẤT ĐẶT HÀNG
        </Box>
        <div style={{ textAlign: 'center', fontWeight: 'bold', margin: 5 }}>
          Phiếu {data.maPhieu}
        </div>{' '}
      </Box>

      {/* INFO */}
      <Box m={1}>
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
          {[
            ...new Set(
              (data?.phieuDeXuatDetail ?? []).map((x: any) => x.phieuDatHangNhap).filter(Boolean)
            ),
          ].join(', ')}
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 650, mt: 1 }}>
        <Table
          size="small"
          sx={{
            '& .MuiTableCell-root': {
              py: 0.5,
              fontSize: 12,
            },
          }}
        >
          <TableHead
            sx={{
              '& .MuiTableCell-root': {
                textAlign: 'center',
                verticalAlign: 'middle',
              },
            }}
          >
            <TableRow
              sx={{
                position: 'sticky',
                top: 0,
                backgroundColor: '#fff',
                zIndex: 11,
              }}
            >
              {/* <TableCell sx={{ width: 100 }}>NCC</TableCell>
              <TableCell>Thời gian</TableCell> */}
              <TableCell sx={{ width: 70 }}>Chi nhánh</TableCell>
              <TableCell sx={{ width: 180 }}>Mã hàng</TableCell>
              <TableCell sx={{ width: 160 }}>Tên hàng</TableCell>
              <TableCell sx={{ width: 140 }}>Ghi chú hàng hoá</TableCell>
              <TableCell sx={{ width: 30 }}>SL kho đặt</TableCell>
              <TableCell sx={{ width: 30 }}>Giá vốn</TableCell>
              <TableCell sx={{ width: 30 }}>Giá bán</TableCell>
              <TableCell sx={{ width: 30 }}>Nhập chuyển</TableCell>
              <TableCell sx={{ width: 30 }}>Xuất bán</TableCell>
              <TableCell sx={{ width: 30 }}>Tồn cuối</TableCell>
              <TableCell sx={{ width: 90 }}>SL thu mua đề xuất</TableCell>
              <TableCell sx={{ width: 70 }}>Cảnh báo</TableCell>
              <TableCell sx={{ width: 70 }}>SL có thể đặt</TableCell>
              <TableCell sx={{ width: 250 }}>Chú thích</TableCell>
            </TableRow>

            <TableRow
              sx={{
                position: 'sticky',
                top: 70,
                backgroundColor: '#fff',
                zIndex: 10,
              }}
            >
              {/* <TableCell> */}
              {/* <TextField
                  size="small"
                  placeholder="Tìm NCC"
                  value={search.ncc}
                  onChange={(e) => setSearch({ ...search, ncc: e.target.value })}
                />
              </TableCell>
              <TableCell /> */}

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
              const code = normalize(row.maHang);

              const xntRows =
                data.xntDetail?.filter((item) => normalize(item.maHang) === code) ?? [];

              // Tìm dữ liệu đã lưu trong SQL
              const datHangDetail = data.phieuDatHangDetail?.find(
                (item) => normalize(item.maHang) === code
              );

              // Dòng mới lấy từ XNT, dòng cũ lấy từ SQL
              const rawSlCoTheDat = row.isNew
                ? row.slCoTheDat
                : (datHangDetail?.slCoTheDat ?? row.slCoTheDat);

              const slCoTheDat: number | string =
                rawSlCoTheDat == null ? 'SKU chưa có trong định mức' : rawSlCoTheDat;
              // const totalTon = xntRows.reduce((sum, item) => sum + Number(item.tonCuoi ?? 0), 0);

              // const tonToiUu = Number(xntRows[0]?.slTonToiUu ?? 0);

              // const detailByCode = data.phieuDatHangDetail?.find(
              //   (item) => item.maHang?.trim().toUpperCase() === code
              // );
              // =====================================================
              // XNT FALLBACK THEO MÃ HÀNGÍ
              // ưu tiên dòng có SL tồn tối ưu
              // =====================================================
              // const xntByCode = data.xntDetail?.find(
              //   (item) => item.maHang?.trim().toUpperCase() === code && item.slTonToiUu != null
              // );

              // =====================================================
              // CẢNH BÁO
              // =====================================================
              // const canhBao =
              //   detailByCode?.canhBao ??
              //   xntByCode?.canhBao ??
              //   row.canhBao ??
              //   'SKU chưa có trong định mức';

              // =====================================================
              // SL CÓ THỂ ĐẶT
              // =====================================================
              // const slCoTheDat: number | string =
              //   detailByCode?.['slCoTheDat'] ??
              //   xntByCode?.['slTonToiUu'] ??
              //   'SKU chưa có trong định mức';

              // const slCoTheDat: number | string =
              //   xntRows.length === 0
              //     ? 'SKU chưa có trong định mức'
              //     : totalTon <= tonToiUu
              //       ? tonToiUu - totalTon
              //       : 'Vượt tồn tối ưu';

              return (
                <TableRow
                  key={`${row['chiNhanh']}-${row['maHang']}-${row['tenHang']}-${page}-${index}`}
                >
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
                        value={row['maHang'] ?? ''}
                        disabled={!row['chiNhanh'] || !row.isNew}
                        onChange={(e) => {
                          const value = e.target.value;

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
                        onPaste={(e) => {
                          const value = e.clipboardData.getData('text');

                          setTimeout(() => {
                            handleSelectMaHang(row.id, value);
                          }, 0);
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
                  <TableCell sx={{ fontWeight: 'bold' }}>{row['slKhoDat']}</TableCell>
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
                  {/* <TableCell>{row.canhBao}</TableCell> */}
                  {/* <TableCell>
                    <TableCell>
                      {row.canhBao === 'Vượt tồn tối ưu'
                        ? 'Vượt tồn tối ưu'
                        : Number(row.slCoTheDat) === 0
                          ? slCoTheDat
                          : slCoTheDat}
                    </TableCell>
                  </TableCell> */}
                  {/* <TableCell>{row.slCoTheDat}</TableCell> */}
                  <TableCell>{row.canhBao || ''}</TableCell>
                  <TableCell>
                    {typeof slCoTheDat === 'number'
                      ? slCoTheDat.toLocaleString('vi-VN')
                      : slCoTheDat}
                  </TableCell>

                  <TableCell>
                    <TextField
                      inputRef={(el) => {
                        chuThichRefs.current[index] = el;
                      }}
                      size="small"
                      multiline
                      minRows={1}
                      maxRows={10}
                      fullWidth
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

      <DialogActions>
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[50]}
          onPageChange={(event, newPage) => setPage(newPage)}
        />
        <Button variant="outlined" onClick={handleBack}>
          Quay lại
        </Button>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddRow}
          disabled={['DA_DUYET', 'TRA_LAI', 'CHO_DUYET'].includes(data.trangThai)}
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
                { id: 'chuThich', label: 'Chú thích' },
                { id: 'giaVon', label: 'Đơn giá' },
                { id: 'thuMuaNhap', label: 'Số lượng đặt hàng' },
              ],
            });
          }}
        />
      </DialogActions>
    </>
  );
}
