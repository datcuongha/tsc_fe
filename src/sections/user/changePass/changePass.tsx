import type { SubmitHandler } from 'react-hook-form';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ref, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Grid from '@mui/material/GridLegacy';
import {
  Button,
  TextField,
  InputLabel,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';

import { changePass } from 'src/apis/user';

import { Iconify } from 'src/components/iconify';
import { showAlert } from 'src/components/alert';

import { widthImport } from 'src/sections/invoice-it/utils';

import type { EditChangePassForm, EditChangePassProps } from './type';

const editSchema = object({
  pass: string()
    .required('Không để trống mật khẩu')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
    ),
  confirmPass: string()
    .required('Vui lòng nhập lại mật khẩu')
    .oneOf([ref('pass')], 'Mật khẩu nhập lại không khớp'),
});

export function ChangePass({ handleClose, data }: EditChangePassProps) {
  const queryClient = useQueryClient();
  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      pass: '',
      confirmPass: '',
    },
    resolver: yupResolver(editSchema),
    mode: 'onTouched',
  });
  const pass = watch('pass');
  
  const { mutate } = useMutation({
    mutationFn: (values: EditChangePassForm) => {
      const forrmatValues = {
        ...values,
        userId: data?.userId,
      };
      return changePass(forrmatValues);
    },
    onError: (error) => {
      showAlert(error);
    },
    onSuccess: () => {
      showAlert({ type: 'success', message: 'Thành công' });
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ['dataUser'],
      });
    },
  });

  const handleFormSubmit: SubmitHandler<EditChangePassForm> = (payload) => {
    mutate(payload);
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <DialogTitle>Đổi mật khẩu</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center" justifyContent="flex-start" sx={{ mb: 1 }}>
          <Grid item xs={4}>
            <InputLabel>Mật khẩu</InputLabel>
          </Grid>
          <Grid item xs={8}>
            <TextField
              sx={{ ...widthImport }}
              variant="standard"
              error={!!errors.pass}
              {...register('pass')}
              helperText={errors.pass?.message}
              type={showPass ? 'text' : 'password'}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                        <Iconify icon={showPass ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" justifyContent="flex-start" sx={{ mb: 1 }}>
          <Grid item xs={4}>
            <InputLabel>Nhập lại mật khẩu </InputLabel>
          </Grid>
          <Grid item xs={8}>
            <TextField
              sx={{ ...widthImport }}
              variant="standard"
              error={!!errors.confirmPass}
              {...register('confirmPass')}
              helperText={errors.confirmPass?.message}
              type={showConfPass ? 'text' : 'password'}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfPass(!showConfPass)} edge="end">
                        <Iconify icon={showConfPass ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
        </Grid>

        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            Huỷ
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </DialogContent>
    </form>
  );
}
