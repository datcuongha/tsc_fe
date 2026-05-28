import type { SubmitHandler } from 'react-hook-form';

import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { editUserInfo } from 'src/apis/user';
import { useAuth } from 'src/context/authContext';

import { FormField } from 'src/components/form';
import { showAlert, capitalizeFirstLetter } from 'src/components/alert';

import { widthImport } from 'src/sections/invoice-it/utils';

import type { EditUserPayload, EditUserInfoForm, EditUserInfoProps } from './type';

const editInfoSchema = object({
  fullName: string().required('Vui lòng không để trống'),
  userName: string(),
  phone: string().test('is-number', 'Phải là số', (value) => {
    if (!value) return true;
    return /^\d+$/.test(value);
  }),
  email: string().email('Email không đúng định dạng').required('Vui lòng nhập Email'),
  brithday: string().nullable().notRequired(),
  address: string().nullable().notRequired(),
});

export function EditUserInfo({ handleClose, data }: EditUserInfoProps) {
  const { setUser } = useAuth();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: data?.fullName,
      phone: data?.phone,
      email: data?.email,
      brithday: data?.brithday ? new Date(data.brithday).toISOString().split('T')[0] : '',
      address: data?.address,
    },
    resolver: yupResolver(editInfoSchema),
    mode: 'onTouched',
  });

  type FieldName = keyof EditUserInfoForm;
  const fields: { name: FieldName; label: string }[] = [
    { name: 'fullName', label: 'Họ tên' },
    { name: 'email', label: 'Email' },
    { name: 'phone', label: 'Số điện thoại' },
    { name: 'brithday', label: 'Ngày sinh' },
    { name: 'address', label: 'Địa chỉ' },
  ];

  const { mutate } = useMutation({
    mutationFn: (values: EditUserPayload) => {
      const formatValue = {
        ...values,
        fullName: capitalizeFirstLetter(values.fullName),
        address: capitalizeFirstLetter(values.address ?? ''),
      };
      return editUserInfo(formatValue);
    },
    onError: (error) => {
      showAlert(error);
    },
    onSuccess: (_, variables) => {
      setUser((prev: any) => ({
        ...prev,
        data: {
          ...prev?.data,
          fullName: capitalizeFirstLetter(variables.fullName),
          email: variables.email,
          phone: variables.phone,
          brithday: variables.brithday,
          address: variables.address,
        },
      }));

      showAlert({
        message: 'Thành công',
        type: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['userInfo'],
      });

      handleClose();
    },
  });
  const handleForSubmit: SubmitHandler<EditUserInfoForm> = (value) => {
    const payload: EditUserPayload = {
      ...value,
      userId: data!.userId,
    };
    mutate(payload);
  };
  return (
    <form onSubmit={handleSubmit(handleForSubmit)}>
      <DialogTitle>Sửa thông tin cá nhân</DialogTitle>
      <DialogContent>
        {fields.map((f, index) => (
          <FormField key={f.name} label={f.label}>
            <TextField
              type={f.name === 'brithday' ? 'date' : 'text'}
              variant="standard"
              sx={{ ...widthImport }}
              {...register(f.name)}
              error={!!errors[f.name]}
              helperText={errors[f.name]?.message}
            />
          </FormField>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Huỷ
        </Button>
        <Button type="submit" variant="contained">
          Đồng ý
        </Button>
      </DialogActions>
    </form>
  );
}
