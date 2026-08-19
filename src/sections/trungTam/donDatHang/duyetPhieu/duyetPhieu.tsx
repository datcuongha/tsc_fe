import { useParams, useNavigate } from 'react-router-dom';
// import { useParams, useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Box,
  Alert,
  Table,
  Button,
  Dialog,
  TableRow,
  Backdrop,
  TableHead,
  TableCell,
  TableBody,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { editSLPGD, duyetPhieu, tuChoiPhieu, getPhieuById } from 'src/apis/datHang';

import { showAlert } from 'src/components/alert';

// ----------------------------------------------------------------------

export function DuyetPhieuView() {
  const { id } = useParams();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [openReject, setOpenReject] = useState(false);

  const [rows, setRows] = useState<any[]>([]);

  const [editMode, setEditMode] = useState(false);

  const lyDoTraLaiRef = useRef('');

  // =====================================================
  // GET PHIẾU
  // =====================================================

  const {
    data: responseDuyet,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['phieuDuyet', id],

    queryFn: () => getPhieuById(id),

    enabled: !!id,

    retry: false,
  });

  // =====================================================
  // RESPONSE BE
  //
  // {
  //   status
  //   canApprove
  //   message
  //   content
  //   capDuyet
  // }
  // =====================================================

  const dataDuyet = responseDuyet ?? {};

  const canApprove = responseDuyet?.canApprove ?? false;

  const approvalStatus = responseDuyet?.status ?? null;

  const approvalMessage = responseDuyet?.message ?? '';

  const capDuyet = Number(responseDuyet?.capDuyet) || 0;

  // =====================================================
  // NGƯỜI DUYỆT CẤP 1
  // =====================================================

  const duyetCap1 = dataDuyet?.phieuDatHangDuyet?.find(
    (x: any) => x.capDuyet === 1 && x.trangThai === 'DA_DUYET'
  );

  // =====================================================
  // NGƯỜI DUYỆT CẤP 2
  // =====================================================

  const duyetCap2 = dataDuyet?.phieuDatHangDuyet?.find(
    (x: any) => x.capDuyet === 2 && x.trangThai === 'DA_DUYET'
  );

  // =====================================================
  // LOAD DETAIL
  // =====================================================

  useEffect(() => {
    if (!dataDuyet?.phieuDatHangDetail) {
      return;
    }

    setRows(
      dataDuyet.phieuDatHangDetail.map((item: any) => {
        const soLuongPGDDuyet = item.soLuongPGDDuyet ?? item.soLuong;

        return {
          ...item,

          soLuongPGDDuyet,

          soLuongGDDuyet: item.soLuongGDDuyet ?? soLuongPGDDuyet,
        };
      })
    );
  }, [dataDuyet]);

  // =====================================================
  // XỬ LÝ ERROR
  // =====================================================

  useEffect(() => {
    if (!error) {
      return;
    }

    showAlert({
      type: 'error',
      message: (error as any)?.message || 'Không thể tải phiếu',
    });

    navigate('/in-dat-hang', {
      replace: true,
    });
  }, [error, navigate]);

  // =====================================================
  // DUYỆT
  // =====================================================

  const sendMutation = useMutation({
    mutationFn: duyetPhieu,

    onSuccess: () => {
      showAlert({
        type: 'success',
        message: 'Đã duyệt phiếu',
      });

      queryClient.invalidateQueries({
        queryKey: ['phieuDuyet', id],
      });

      queryClient.invalidateQueries({
        queryKey: ['dataDH'],
      });

      navigate('/in-dat-hang');
    },

    onError: (err: any) => {
      showAlert({
        type: 'error',
        message: err?.message || 'Duyệt phiếu thất bại',
      });
    },
  });

  // =====================================================
  // TỪ CHỐI
  // =====================================================

  const rejectMutation = useMutation({
    mutationFn: tuChoiPhieu,

    onSuccess: () => {
      showAlert({
        type: 'success',
        message: 'Đã từ chối phiếu',
      });

      setOpenReject(false);

      lyDoTraLaiRef.current = '';

      queryClient.invalidateQueries({
        queryKey: ['phieuDuyet', id],
      });

      queryClient.invalidateQueries({
        queryKey: ['dataDH'],
      });

      navigate('/in-dat-hang');
    },

    onError: (err: any) => {
      showAlert({
        type: 'error',
        message: err?.message || 'Từ chối phiếu thất bại',
      });
    },
  });

  // =====================================================
  // CẬP NHẬT SỐ LƯỢNG
  // =====================================================

  const editMutation = useMutation({
    mutationFn: editSLPGD,

    onSuccess: (_, variables) => {
      if (variables.showMessage !== false) {
        showAlert({
          type: 'success',
          message: 'Đã cập nhật thành công',
        });
      }

      queryClient.invalidateQueries({
        queryKey: ['phieuDuyet', id],
      });
    },

    onError: (err: any, variables) => {
      if (variables.showMessage !== false) {
        showAlert({
          type: 'error',
          message: err?.message || 'Cập nhật thất bại',
        });
      }
    },
  });

  // =====================================================
  // THAY ĐỔI SỐ LƯỢNG
  // =====================================================

  const handleChange = (index: number, field: string, value: string | number) => {
    const updated = [...rows];

    updated[index] = {
      ...updated[index],

      [field]: value,
    };

    setRows(updated);
  };

  // =====================================================
  // LƯU SỐ LƯỢNG
  // =====================================================

  const handleUpdate = () => {
    if (!canApprove) {
      showAlert({
        type: 'error',
        message: 'Phiếu này không còn quyền chỉnh sửa',
      });

      return;
    }

    editMutation.mutate({
      id: dataDuyet.id,

      showMessage: true,

      phieuDatHangDetail: rows.map((item) => ({
        id: item.id,

        soLuongPGDDuyet:
          item.soLuongPGDDuyet === '' || item.soLuongPGDDuyet == null
            ? null
            : Number(item.soLuongPGDDuyet),

        soLuongGDDuyet:
          item.soLuongGDDuyet === '' || item.soLuongGDDuyet == null
            ? null
            : Number(item.soLuongGDDuyet),
      })),
    });
  };

  // =====================================================
  // DUYỆT PHIẾU
  //
  // Lưu số lượng trước
  // sau đó mới gọi API duyệt
  // =====================================================

  const handleApprove = async () => {
    if (!canApprove) {
      showAlert({
        type: 'error',
        message: approvalMessage || 'Phiếu này không còn chờ bạn duyệt',
      });

      return;
    }

    try {
      // ===============================================
      // 1. LƯU SỐ LƯỢNG
      // ===============================================

      await editMutation.mutateAsync({
        id: dataDuyet.id,

        showMessage: false,

        phieuDatHangDetail: rows.map((item) => ({
          id: item.id,

          soLuongPGDDuyet:
            item.soLuongPGDDuyet === '' || item.soLuongPGDDuyet == null
              ? Number(item.soLuong)
              : Number(item.soLuongPGDDuyet),

          soLuongGDDuyet:
            item.soLuongGDDuyet === '' || item.soLuongGDDuyet == null
              ? Number(item.soLuongPGDDuyet ?? item.soLuong)
              : Number(item.soLuongGDDuyet),
        })),
      });

      // ===============================================
      // 2. DUYỆT
      // ===============================================

      await sendMutation.mutateAsync(dataDuyet.id);
    } catch (err: any) {
      showAlert({
        type: 'error',
        message: err?.message || 'Duyệt phiếu thất bại',
      });
    }
  };

  // =====================================================
  // NGÀY KHO ĐẶT
  // =====================================================

  const dates = [
    ...new Set(
      (dataDuyet.phieuDeXuatDetail ?? [])
        .map((x: any) => x.ngayKhoDat)
        .filter(
          (d: any) =>
            d && d !== '0' && d !== 0 && d !== '0000-00-00' && !Number.isNaN(new Date(d).getTime())
        )
    ),
  ].sort() as string[];

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <Backdrop
        open
        sx={(theme) => ({
          color: '#fff',

          zIndex: theme.zIndex.modal + 999,

          flexDirection: 'column',

          gap: 2,
        })}
      >
        <CircularProgress color="inherit" />

        <div>Đang tải phiếu...</div>
      </Backdrop>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      {/* ================================================= */}
      {/* THÔNG BÁO TRẠNG THÁI */}
      {/* ================================================= */}

      {!canApprove && approvalStatus === 'DA_DUYET' && (
        <Alert
          severity="success"
          sx={{
            m: 2,
          }}
        >
          {approvalMessage || 'Phiếu này đã được duyệt rồi'}
        </Alert>
      )}

      {!canApprove && approvalStatus === 'TU_CHOI' && (
        <Alert
          severity="warning"
          sx={{
            m: 2,
          }}
        >
          {approvalMessage || 'Phiếu này đã được trả lại'}
        </Alert>
      )}

      {!canApprove && approvalStatus === 'TRA_LAI' && (
        <Alert
          severity="warning"
          sx={{
            m: 2,
          }}
        >
          {approvalMessage || 'Phiếu này đã được trả lại'}
        </Alert>
      )}

      {canApprove && (
        <Alert
          severity="info"
          sx={{
            m: 2,
          }}
        >
          {approvalMessage || 'Phiếu đang chờ bạn duyệt'}
        </Alert>
      )}

      {/* ================================================= */}
      {/* ACTION */}
      {/* ================================================= */}

      <DialogActions>
        {canApprove ? (
          <>
            <Button
              variant="contained"
              color={editMode ? 'success' : 'warning'}
              disabled={sendMutation.isPending || rejectMutation.isPending}
              onClick={() => {
                if (editMode) {
                  handleUpdate();

                  setEditMode(false);
                } else {
                  setEditMode(true);
                }
              }}
            >
              {editMode ? 'Lưu' : 'Sửa thông tin'}
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={handleApprove}
              disabled={editMode || sendMutation.isPending || editMutation.isPending}
            >
              Duyệt
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenReject(true)}
              disabled={editMode || sendMutation.isPending || rejectMutation.isPending}
            >
              Từ chối
            </Button>
          </>
        ) : (
          <Button variant="outlined" onClick={() => navigate('/in-dat-hang')}>
            Quay lại
          </Button>
        )}
      </DialogActions>

      {/* ================================================= */}
      {/* NỘI DUNG PHIẾU */}
      {/* ================================================= */}

      <Box m={1}>
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
          <b>Tên công ty:</b> {dataDuyet.congTy}
        </Box>

        <Box mb={1}>
          <b>Nhà cung cấp:</b> {dataDuyet.tenNcc}
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
              (dataDuyet?.phieuDeXuatDetail ?? [])
                .map((x: any) => x.phieuDatHangNhap)
                .filter(Boolean)
            ),
          ].join(', ')}
        </Box>

        <Box
          sx={{
            display: 'flex',
            width: 'auto',
            mx: 'auto',
          }}
        >
          <Box
            sx={{
              flex: 1,
              textAlign: 'left',
            }}
          >
            <Box fontWeight="bold">Nội dung đề xuất như sau:</Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              textAlign: 'right',
            }}
          >
            <Box fontWeight="bold">
              <b>Kỳ số liệu tham khảo:</b>{' '}
              {dataDuyet.fromDate ? new Date(dataDuyet.fromDate).toLocaleDateString('vi-VN') : ''}
              {' - '}
              {dataDuyet.toDate ? new Date(dataDuyet.toDate).toLocaleDateString('vi-VN') : ''}
            </Box>
          </Box>
        </Box>

        {/* ================================================= */}
        {/* TABLE */}
        {/* ================================================= */}

        <Table
          sx={{
            border: '1px solid black',

            '& td, & th': {
              border: '1px solid black',

              padding: '4px',

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

              <TableCell align="center">Số lượng</TableCell>

              {capDuyet >= 1 && <TableCell align="center">PGD duyệt</TableCell>}

              {capDuyet >= 2 && <TableCell align="center">GD duyệt</TableCell>}

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
            {rows.map((item, index) => (
              <TableRow key={`${item.id}-${index}`}>
                <TableCell
                  align="center"
                  sx={{
                    width: 45,
                  }}
                >
                  {index + 1}
                </TableCell>

                <TableCell
                  sx={{
                    width: 120,
                  }}
                >
                  {item.maHang}
                </TableCell>

                <TableCell
                  sx={{
                    width: 250,
                  }}
                >
                  {item.tenSp}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: 45,
                  }}
                >
                  {item.dvt}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: 75,
                  }}
                >
                  {Number(item.donGia || 0).toLocaleString('vi-VN')}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: 45,
                  }}
                >
                  {item.soLuong}
                </TableCell>

                {/* =================================== */}
                {/* PGD */}
                {/* =================================== */}

                {capDuyet >= 1 && (
                  <TableCell
                    align="center"
                    sx={{
                      width: 45,
                    }}
                  >
                    {editMode && canApprove ? (
                      <TextField
                        type="number"
                        variant="standard"
                        value={item.soLuongPGDDuyet ?? ''}
                        onChange={(e) =>
                          handleChange(
                            index,

                            'soLuongPGDDuyet',

                            e.target.value === '' ? '' : Number(e.target.value)
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e') {
                            e.preventDefault();
                          }
                        }}
                        inputProps={{
                          min: 0,
                        }}
                      />
                    ) : (
                      item.soLuongPGDDuyet
                    )}
                  </TableCell>
                )}

                {/* =================================== */}
                {/* GD */}
                {/* =================================== */}

                {capDuyet >= 2 && (
                  <TableCell
                    align="center"
                    sx={{
                      width: 45,
                    }}
                  >
                    {editMode && canApprove ? (
                      <TextField
                        type="number"
                        variant="standard"
                        value={item.soLuongGDDuyet ?? ''}
                        onChange={(e) =>
                          handleChange(
                            index,

                            'soLuongGDDuyet',

                            e.target.value === '' ? '' : Number(e.target.value)
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e') {
                            e.preventDefault();
                          }
                        }}
                        inputProps={{
                          min: 0,
                        }}
                      />
                    ) : (
                      item.soLuongGDDuyet
                    )}
                  </TableCell>
                )}

                <TableCell
                  sx={{
                    width: 120,
                  }}
                >
                  {item.ghiChuHangHoa}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: 55,
                  }}
                >
                  {item.slKhoDat}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: 120,
                  }}
                >
                  {item.slCoTheDat}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: 55,
                  }}
                >
                  {item.slTonToiUu}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: 55,
                  }}
                >
                  {item.tonCuoi}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: 55,
                  }}
                >
                  {item.slBanCuoi}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: 55,
                  }}
                >
                  {item.slNhapNccCuoi}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* ================================================= */}
        {/* SIGN */}
        {/* ================================================= */}

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
          {/* THU MUA */}

          <Box>
            <Box fontWeight="bold">THU MUA</Box>

            <Box fontWeight="bold" mt={28}>
              {dataDuyet.users?.fullName}
            </Box>

            {dataDuyet.ngayGui && (
              <Box fontWeight="bold" mt={1}>
                Ngày đề xuất: {new Date(dataDuyet.ngayGui).toLocaleString('vi-VN')}
              </Box>
            )}
          </Box>

          {/* PGD */}

          <Box
            sx={{
              textAlign: 'center',
            }}
          >
            <Box
              fontWeight="bold"
              sx={{
                maxWidth: '160px',

                mx: 'auto',

                whiteSpace: 'normal',

                wordBreak: 'break-word',

                textAlign: 'center',
              }}
            >
              PHÓ GĐTT / TRƯỞNG KHỐI VẬN HÀNH
            </Box>

            <Box fontWeight="bold" mt={21}>
              {duyetCap1?.users?.fullName}
            </Box>

            {duyetCap1?.ngayDuyet && (
              <Box fontWeight="bold" mt={1}>
                Ngày xét duyệt: {new Date(duyetCap1.ngayDuyet).toLocaleString('vi-VN')}
              </Box>
            )}
          </Box>

          {/* GD */}

          <Box>
            <Box fontWeight="bold">GIÁM ĐỐC TRUNG TÂM</Box>

            <Box fontWeight="bold" mt={18}>
              {duyetCap2?.users?.fullName}
            </Box>

            {duyetCap2?.ngayDuyet && (
              <Box fontWeight="bold" mt={1}>
                Ngày xét duyệt: {new Date(duyetCap2.ngayDuyet).toLocaleString('vi-VN')}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* ================================================= */}
      {/* DIALOG TỪ CHỐI */}
      {/* ================================================= */}

      <Dialog open={openReject} onClose={() => setOpenReject(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Từ chối phiếu</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            label="Lý do từ chối"
            onChange={(e) => {
              lyDoTraLaiRef.current = e.target.value;
            }}
            sx={{
              mt: 1,
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenReject(false)}>Hủy</Button>

          <Button
            color="error"
            variant="contained"
            disabled={rejectMutation.isPending}
            onClick={() => {
              const lyDo = lyDoTraLaiRef.current.trim();

              if (!lyDo) {
                showAlert({
                  type: 'error',
                  message: 'Vui lòng nhập lý do từ chối',
                });

                return;
              }

              rejectMutation.mutate({
                id: dataDuyet.id,

                lyDoTraLai: lyDo,

                action: 'TU_CHOI',
              });
            }}
          >
            Xác nhận từ chối
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================================================= */}
      {/* BACKDROP */}
      {/* ================================================= */}

      <Backdrop
        open={sendMutation.isPending || rejectMutation.isPending || editMutation.isPending}
        onClick={(e) => e.preventDefault()}
        sx={(theme) => ({
          color: '#fff',

          zIndex: theme.zIndex.modal + 999,

          flexDirection: 'column',

          gap: 2,
        })}
      >
        <CircularProgress color="inherit" />

        <div>Đang xử lý, vui lòng chờ...</div>
      </Backdrop>
    </>
  );
}
