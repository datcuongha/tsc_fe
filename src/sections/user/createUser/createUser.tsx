import type { SubmitHandler } from 'react-hook-form';

import { useState } from 'react';
import { ref, object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Button,
  TextField,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  InputAdornment,
} from '@mui/material';

import { createUser } from 'src/apis/user';
import { getDataBp } from 'src/apis/boPhan';
import { getDataRole } from 'src/apis/role';

import { Iconify } from 'src/components/iconify';
import { useModal } from 'src/components/button';
import { ModalManager } from 'src/components/modal';
import { FormField, SelectWithAdd } from 'src/components/form';
import { showAlert, capitalizeFirstLetter } from 'src/components/alert';

import { BoPhan } from 'src/sections/boPhan/view';
import { CreateRole } from 'src/sections/vaiTro/createRole';
import { widthImport } from 'src/sections/invoice-it/utils';

import type { FilterDataBp, CreateUserForm, CreateUserPros, CreateUserPayload } from './type';

const createUserSchema = object({
  userName: string().required('Không để trống tên đăng nhập'),
  pass: string()
    .required('Không để trống mật khẩu')
    .min(8, 'Mật khẩu phải ít nhất 8 ký tự')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
    ),
  confirmPass: string()
    .required('Vui lòng nhập lại mật khẩu')
    .oneOf([ref('pass')], 'Mật khẩu nhập lại không khớp'),
  email: string().email('Email không đúng định dạng').required('Không được để trống email'),
  brithday: string(),
  phone: string().test('is-number', 'Phải là số', (value) => {
    if (!value) return true; // ✅ cho phép rỗng
    return /^\d+$/.test(value);
  }),
  fullName: string().required('Không được để trống họ tên'),
  address: string(),
  boPhan: string().required('Vui lòng chọn bộ phận'),
  vaiTro: string().required('Vui lòng chọn vai trò'),
});

export function CreateUser({ handleClose }: CreateUserPros) {
  const { open, openModal, closeModal } = useModal();
  const queryClient = useQueryClient();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      userName: '',
      pass: '',
      email: '',
      brithday: '',
      phone: '',
      fullName: '',
      address: '',
      boPhan: '',
      vaiTro: '',
    },
    resolver: yupResolver(createUserSchema),
    mode: 'onTouched',
  });

  const { data: dataBp = [] } = useQuery<FilterDataBp[]>({
    queryKey: ['dataBp'],
    queryFn: getDataBp,
  });

  const { data: dataRole = [] } = useQuery({
    queryKey: ['dataRole'],
    queryFn: getDataRole,
  });
  const { mutate } = useMutation({
    mutationFn: (values: CreateUserPayload) => {
      const forrmatValues = {
        ...values,
        fullName: capitalizeFirstLetter(values.fullName),
        address: capitalizeFirstLetter(values.address ?? ''),
      };
      return createUser(forrmatValues);
    },
    onError: (error) => {
      showAlert({ type: 'error', message: String(error)});
    },
    onSuccess: () => {
      showAlert({ message: 'Thành công', type: 'success' });
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ['dataUser'],
      });
    },
  });

  const handleFormSubmit: SubmitHandler<CreateUserForm> = ({ confirmPass, ...data }) => {
    mutate(data);
  };

  type FieldName = keyof CreateUserForm;
  const fields: { name: FieldName; label: string }[] = [
    { name: 'fullName', label: 'Họ tên' },
    { name: 'userName', label: 'Tên đăng nhập' },
    { name: 'email', label: 'Email' },
    { name: 'phone', label: 'Số điện thoại' },
    { name: 'brithday', label: 'Ngày sinh' },
    { name: 'address', label: 'Địa chỉ' },
  ] as const;

  type PasswordFieldName = 'pass' | 'confirmPass';
  const [show, setShow] = useState<Record<PasswordFieldName, boolean>>({
    pass: false,
    confirmPass: false,
  });
  const PasswordField = ({ label, name }: { label: string; name: PasswordFieldName }) => (
    <FormField label={label}>
      <TextField
        type={show[name] ? 'text' : 'password'}
        variant="standard"
        sx={widthImport}
        {...register(name)}
        error={!!errors[name]}
        helperText={errors[name]?.message}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShow((prev) => ({
                      ...prev,
                      [name]: !prev[name],
                    }))
                  }
                >
                  <Iconify icon={show[name] ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </FormField>
  );
  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Tạo tài khoản</DialogTitle>
        <DialogContent>
          {fields.map((f, index) => (
            <>
              <FormField key={f.name} label={f.label}>
                <TextField
                  type={f.name === 'brithday' ? 'date' : 'text'}
                  variant="standard"
                  sx={{ ...widthImport }}
                  error={!!errors[f.name]}
                  {...register(f.name)}
                  helperText={errors[f.name]?.message}
                  InputLabelProps={f.name === 'brithday' ? { shrink: true } : undefined}
                />
              </FormField>

              {f.name === 'userName' && (
                <>
                  <SelectWithAdd
                    label="Bộ phận"
                    data={dataBp}
                    value={watch('boPhan')}
                    onChange={(val) => setValue('boPhan', val, { shouldValidate: true })}
                    onOpen={() => openModal('bp')}
                    error={errors.boPhan?.message}
                  />
                  <SelectWithAdd
                    label="Vai trò"
                    data={dataRole}
                    value={watch('vaiTro')}
                    onChange={(val) => setValue('vaiTro', val, { shouldValidate: true })}
                    onOpen={() => openModal('role')}
                    error={errors.vaiTro?.message}
                  />

                  <PasswordField label="Mật khẩu" name="pass" />
                  <PasswordField label="Nhập lại mật khẩu" name="confirmPass" />
                </>
              )}
            </>
          ))}

          <DialogActions>
            <Button color="inherit" onClick={handleClose}>
              Huỷ
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Tạo
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
      <ModalManager open={open === 'bp'} handleClose={closeModal}>
        <BoPhan handleClose={closeModal} />
      </ModalManager>
      <ModalManager open={open === 'role'} handleClose={closeModal}>
        <CreateRole handleClose={closeModal} />
      </ModalManager>
    </>
  );
}
