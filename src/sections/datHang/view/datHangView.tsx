import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import {
  Box,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { process } from 'src/apis/datHang';
import { useAuth } from 'src/context/authContext';

import { useModal } from 'src/components/button';
import { ModalManager } from 'src/components/modal';
import { FileUploadField } from 'src/components/form';
import { PageHeader } from 'src/components/primary-temp/primary-temp';

import { TongHop } from '../tongHop';

import type { FormValues } from './type';

export function DatHangView() {
  const { control, handleSubmit, reset } = useForm<FormValues>();
  const { user } = useAuth();

  const userId = user.data.userId;
  const [data, setData] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const { open, openModal, closeModal } = useModal();

  const onSubmit = async (formDataValues: FormValues) => {
    if (!formDataValues.file1 || !formDataValues.file2) {
      alert('Chọn đủ 2 file');
      return;
    }

    setLoading(true);

    try {
      const result = await process(formDataValues.file1, formDataValues.file2);

      const mappedData = (result || []).map((item: any) => ({
        ...item,
        thuMuaNhap: item.thuMuaNhap ?? '',
      }));

      setData(mappedData);

      reset({
        file1: null,
        file2: null,
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
        {/* Loading overlay */}
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <DialogTitle>
          <PageHeader title="Tổng hợp" />
        </DialogTitle>

        <DialogContent>
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

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {loading ? 'Đang xử lý...' : 'Xử lý'}
          </Button>
        </DialogActions>

        {data.length > 0 && (
          <ModalManager open={!!open} handleClose={closeModal} maxWidth="xl">
            {open === 'tongHop' && (
              <TongHop data={data} setData={setData} handleClose={closeModal} userId={userId} />
            )}
          </ModalManager>
        )}
      </Box>
    </form>
  );
}
