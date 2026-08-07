import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Grid from '@mui/material/GridLegacy';
import {
  Box,
  Button,
  Backdrop,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { process } from 'src/apis/datHang';
import { useAuth } from 'src/context/authContext';

import { showAlert } from 'src/components/alert';
import { FileUploadField } from 'src/components/form';
import { CalenderCustom } from 'src/components/calender';
import { useModal, ModalManager } from 'src/components/modal';
import { PageHeader } from 'src/components/primary-temp/primary-temp';

import { TongHop } from '../tongHop';

import type { PivotData, FormValues } from './type';

export function DatHangView() {
  const { control, handleSubmit, reset } = useForm<FormValues>();
  const { user } = useAuth();

  const userId = user.data.userId;
  const [data, setData] = useState<PivotData>({
    pivot: [],
    pivot_xnt: [],
    hasDuplicate: false,
    duplicates: [],
  });

  const [loading, setLoading] = useState(false);
  const { open, openModal, closeModal } = useModal();

  const getYesterday = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  };

  const [dateRange, setDateRange] = useState<{
    fromDate: Date | null;
    toDate: Date | null;
  }>({
    fromDate: null,
    toDate: getYesterday(),
  });

  const onSubmit = async (formDataValues: FormValues) => {
    if (!dateRange.fromDate || !dateRange.toDate) {
      showAlert({
        type: 'error',
        message: 'Vui lòng chọn khoảng thời gian',
      });
      return;
    }
    if (!formDataValues.file1 || !formDataValues.file2) {
      showAlert({
        type: 'error',
        message: 'Vui lòng thêm file',
      });
      return;
    }

    setLoading(true);

    try {
      const result = await process(formDataValues.file1, formDataValues.file2);
      console.log(result.hasDuplicate);
      console.log(result.duplicates);

      if (result?.success === false) {
        showAlert({
          type: 'warning',
          message:
            result.message +
            '\n\n' +
            result.duplicates.map((x: any) => `• ${x.phieuDatHangNhap} (${x.maPhieu})`).join('\n'),
        });

        return;
      }

      if (!result || (!result.pivot?.length && !result.pivot_xnt?.length)) {
        showAlert({
          type: 'warning',
          message: 'Không có dữ liệu',
        });
        return;
      }

      const mappedPivot = (result.pivot || []).map((item: any) => ({
        ...item,
        thuMuaNhap: item.thuMuaNhap ?? '',
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
      }));

      // const mappedPivotXnt = (result.pivot_xnt || []).map((item: any) => ({
      //   ...item,
      // }));

      const mappedPivotXnt = result.pivot_xnt || [];

      setData({
        pivot: mappedPivot,
        pivot_xnt: mappedPivotXnt,
        hasDuplicate: result.hasDuplicate ?? false,
        duplicates: result.duplicates ?? [],
      });
      reset({
        file1: null,
        file2: null,
      });
      setDateRange({
        fromDate: null,
        toDate: getYesterday(),
      });
      openModal('tongHop');
    } catch (err: any) {
      console.error(err);
      alert(err || 'Lỗi xử lý');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ position: 'relative' }}>
        <DialogTitle>
          <PageHeader title="Tổng hợp" />
        </DialogTitle>

        <DialogContent>
          <Grid item xs={9}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 5,
              }}
            >
              <Box sx={{ width: 500, mt: 1 }}>
                <CalenderCustom value={dateRange} onChange={setDateRange} />
              </Box>
            </Box>
          </Grid>

          <Controller
            name="file1"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <FileUploadField
                label="File xuất nhập tồn chi tiết:"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="file2"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <FileUploadField
                label="File tổng hợp đặt hàng kho:"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button color="inherit">Huỷ</Button>

          <Button type="submit" variant="contained" disabled={loading}>
            Xử lý
          </Button>
        </DialogActions>

        {data.pivot.length > 0 && (
          <ModalManager open={!!open} handleClose={closeModal} maxWidth="xl">
            {open === 'tongHop' && (
              <TongHop
                pivot={data.pivot}
                pivotXnt={data.pivot_xnt}
                setData={setData}
                handleClose={closeModal}
                hasDuplicate={data.hasDuplicate}
                duplicates={data.duplicates}
                userId={userId}
              />
            )}
          </ModalManager>
        )}
      </Box>

      <Backdrop
        open={loading}
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
    </form>
  );
}
