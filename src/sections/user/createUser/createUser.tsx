import type { SubmitHandler } from 'react-hook-form';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ref, object, string, number } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Button,
  TextField,
  IconButton,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
  InputAdornment,
} from '@mui/material';

import { getAllBp } from 'src/apis/boPhan';
import { getDataRole } from 'src/apis/role';
import { createUser, getAllUser } from 'src/apis/user';

import { Iconify } from 'src/components/iconify';
import { useModal, ModalManager } from 'src/components/modal';
import { FormField, SelectWithAdd } from 'src/components/form';
import { showAlert, capitalizeFirstLetter } from 'src/components/alert';

import { CreateRole } from 'src/sections/vaiTro/createRole';
import { widthImport } from 'src/sections/invoice-it/utils';
import { CreateBoPhan } from 'src/sections/boPhan/createBp';

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
  managerId: number().nullable().optional(),
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
      managerId: null,
    },
    resolver: yupResolver(createUserSchema),
    mode: 'onTouched',
  });
  const { data: dataUser = [] } = useQuery({
    queryKey: ['dataUser'],
    queryFn: getAllUser,
  });
  const { data: dataBp = [] } = useQuery<FilterDataBp[]>({
    queryKey: ['dataBp'],
    queryFn: getAllBp,
  });

  const { data: dataRole = [] } = useQuery({
    queryKey: ['dataRole'],
    queryFn: getDataRole,
  });

  // const { mutate } = useMutation({
  //   mutationFn: (values: CreateUserPayload) => {
  //     const forrmatValues = {
  //       ...values,
  //       fullName: capitalizeFirstLetter(values.fullName),
  //       address: capitalizeFirstLetter(values.address ?? ''),
  //     };
  //     return createUser(forrmatValues);
  //   },
  //   onError: (error) => {
  //     showAlert({ type: 'error', message: String(error) });
  //   },
  //   onSuccess: () => {
  //     showAlert({ message: 'Thành công', type: 'success' });
  //     handleClose();
  //     queryClient.invalidateQueries({
  //       queryKey: ['dataUser'],
  //     });
  //   },
  // });
  const { mutate } = useMutation({
    mutationFn: (values: CreateUserPayload) => {
      const forrmatValues = {
        ...values,

        managerId: values.managerId ? Number(values.managerId) : null,

        fullName: capitalizeFirstLetter(values.fullName),

        address: capitalizeFirstLetter(values.address ?? ''),
      };

      return createUser(forrmatValues);
    },

    onError: (error) => {
      showAlert({
        type: 'error',
        message: String(error),
      });
    },

    onSuccess: () => {
      showAlert({
        message: 'Thành công',
        type: 'success',
      });

      handleClose();

      queryClient.invalidateQueries({
        queryKey: ['dataUser'],
      });
    },
  });

  // const handleFormSubmit: SubmitHandler<CreateUserForm> = ({ confirmPass, ...data }) => {
  //   mutate(data);
  // };
  const handleFormSubmit: SubmitHandler<CreateUserForm> = ({ confirmPass, managerId, ...data }) => {
    mutate({
      ...data,
      managerId: managerId ? Number(managerId) : null,
    });
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

  const selectedBoPhan = watch('boPhan');

  const filteredUsers = dataUser.filter(
    (item: any) => String(item.boPhanId) === String(selectedBoPhan)
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

              {/* {f.name === 'userName' && (
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
              )} */}
              {f.name === 'userName' && (
                <>
                  <SelectWithAdd
                    label="Bộ phận"
                    data={dataBp}
                    value={watch('boPhan')}
                    onChange={(val) =>
                      setValue('boPhan', val, {
                        shouldValidate: true,
                      })
                    }
                    onOpen={() => openModal('bp')}
                    error={errors.boPhan?.message}
                  />

                  <SelectWithAdd
                    label="Vai trò"
                    data={dataRole}
                    value={watch('vaiTro')}
                    onChange={(val) =>
                      setValue('vaiTro', val, {
                        shouldValidate: true,
                      })
                    }
                    onOpen={() => openModal('role')}
                    error={errors.vaiTro?.message}
                  />
                  <FormField label="Quản lý trực tiếp">
                    <Autocomplete
                      options={filteredUsers}
                      getOptionLabel={(option: any) => option.fullName ?? ''}
                      value={
                        filteredUsers.find((item: any) => item.userId === watch('managerId')) ??
                        null
                      }
                      onChange={(_, value: any) => {
                        setValue('managerId', value ? Number(value.userId) : null, {
                          shouldValidate: true,
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          sx={widthImport}
                          placeholder={selectedBoPhan ? 'Chọn quản lý' : 'Chọn bộ phận trước'}
                        />
                      )}
                      disabled={!selectedBoPhan}
                    />
                  </FormField>

                  <PasswordField label="Mật khẩu" name="pass" />

                  <PasswordField label="Nhập lại mật khẩu" name="confirmPass" />
                </>
              )}
            </>
          ))}
        </DialogContent>

        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            Huỷ
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Tạo
          </Button>
        </DialogActions>
      </form>
      <ModalManager open={open === 'bp'} handleClose={closeModal}>
        <CreateBoPhan handleClose={closeModal} />
      </ModalManager>
      <ModalManager open={open === 'role'} handleClose={closeModal}>
        <CreateRole handleClose={closeModal} />
      </ModalManager>
    </>
  );
}
