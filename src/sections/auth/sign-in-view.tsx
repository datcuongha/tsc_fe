import { useState } from 'react';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { login } from 'src/apis/auth';
import { useAuth } from 'src/context/authContext';

import { Iconify } from 'src/components/iconify';
import { showAlert } from 'src/components/alert';
// ----------------------------------------------------------------------
const infoSchema = object({
  userName: string().required('Vui lòng nhập User name'),
  password: string()
    .required('Không để trống mật khẩu')
    .min(8, 'Mật khẩu phải ít nhất 8 ký tự')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
    ),
});

export function SignInView() {
  const router = useRouter();
  const { saveToken } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(infoSchema),
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const token = data?.token;

      saveToken(token); // 🔥 CHÍNH NÓ

      router.push('/');
    },
    onError: (error: any) => {
      showAlert({
        type: 'error',
        message: error || 'Lỗi hệ thống',
      });
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  const renderForm = (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        label="Tên đăng nhập"
        sx={{ mb: 7 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        {...register('userName')}
        error={!!errors.userName}
        helperText={errors.userName?.message}
      />

      {/* <Link
        variant="body2"
        color="inherit"
        sx={{ mb: 1.5, cursor: 'pointer' }}
        onClick={() => alert('Chức năng đang phát triển')}
      >
        Quên mật khẩu?
      </Link> */}

      <TextField
        fullWidth
        label="Mật khẩu"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Loading...' : 'Đăng nhập'}
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">Đăng nhập</Typography>
      </Box>
      {renderForm}
    </>
  );
}
