import type { SubmitHandler } from 'react-hook-form';

import { useForm } from 'react-hook-form';
import { Fragment, useState } from 'react';
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
import { CreateBoPhan } from 'src/sections/boPhan/createBp';
import { widthImport } from 'src/sections/invoice-it/utils';

import type { CreateUserForm, CreateUserPros, CreateUserPayload } from './type';

// Kiểu dữ liệu dành cho SelectWithAdd
type OptionType = {
  id: string | number;
  name: string;
};

// Kiểu người dùng dành cho Autocomplete
type UserOption = {
  userId: number;
  fullName: string;
  boPhanId?: number | null;
};

// Kiểu response API có thể trả về
type ListResponse<T> = {
  content?: T[] | ListResponse<T>;
  data?: T[] | ListResponse<T>;
  items?: T[] | ListResponse<T>;
};

// Chuyển response API thành mảng
const extractArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (!value || typeof value !== 'object') {
    return [];
  }

  const response = value as ListResponse<T>;

  if (Array.isArray(response.content)) {
    return response.content;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.items)) {
    return response.items;
  }

  // Hỗ trợ response lồng nhau:
  // { data: { content: [...] } }
  if (response.content && typeof response.content === 'object') {
    return extractArray<T>(response.content);
  }

  if (response.data && typeof response.data === 'object') {
    return extractArray<T>(response.data);
  }

  if (response.items && typeof response.items === 'object') {
    return extractArray<T>(response.items);
  }

  return [];
};

const createUserSchema = object({
  userName: string().trim().required('Không để trống tên đăng nhập'),

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

  email: string().trim().email('Email không đúng định dạng').required('Không được để trống email'),

  brithday: string().optional(),

  phone: string()
    .optional()
    .test('is-number', 'Phải là số', (value) => {
      if (!value) return true;

      return /^\d+$/.test(value);
    }),

  fullName: string().trim().required('Không được để trống họ tên'),

  address: string().optional(),

  boPhan: string().required('Vui lòng chọn bộ phận'),

  vaiTro: string().required('Vui lòng chọn vai trò'),

  managerId: number().nullable().optional(),
});

type PasswordFieldName = 'pass' | 'confirmPass';

type FieldName = 'fullName' | 'userName' | 'email' | 'phone' | 'brithday' | 'address';

const fields: {
  name: FieldName;
  label: string;
}[] = [
  {
    name: 'fullName',
    label: 'Họ tên',
  },
  {
    name: 'userName',
    label: 'Tên đăng nhập',
  },
  {
    name: 'email',
    label: 'Email',
  },
  {
    name: 'phone',
    label: 'Số điện thoại',
  },
  {
    name: 'brithday',
    label: 'Ngày sinh',
  },
  {
    name: 'address',
    label: 'Địa chỉ',
  },
];

export function CreateUser({ handleClose }: CreateUserPros) {
  const queryClient = useQueryClient();

  const { open, openModal, closeModal } = useModal();

  const [showPassword, setShowPassword] = useState<Record<PasswordFieldName, boolean>>({
    pass: false,
    confirmPass: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateUserForm>({
    defaultValues: {
      userName: '',
      pass: '',
      confirmPass: '',
      email: '',
      brithday: '',
      phone: '',
      fullName: '',
      address: '',
      boPhan: '',
      vaiTro: '',
      managerId: null,
    },

    resolver: yupResolver(createUserSchema) as any,

    mode: 'onTouched',
  });

  // ==========================================
  // LẤY DANH SÁCH VAI TRÒ
  // ==========================================
  const { data: roleResponse, isLoading: isLoadingRole } = useQuery({
    queryKey: ['role'],
    queryFn: getDataRole,
  });

  // ==========================================
  // LẤY DANH SÁCH BỘ PHẬN
  // ==========================================
  const { data: boPhanResponse, isLoading: isLoadingBoPhan } = useQuery({
    queryKey: ['boPhan'],
    queryFn: getAllBp,
  });

  // ==========================================
  // LẤY DANH SÁCH NGƯỜI DÙNG
  // ==========================================
  const { data: userResponse, isLoading: isLoadingUser } = useQuery({
    queryKey: ['dataUser'],
    queryFn: getAllUser,
  });

  // Luôn trả về array
  const dataRole = extractArray<OptionType>(roleResponse);

  const dataBoPhan = extractArray<OptionType>(boPhanResponse);

  const dataUser = extractArray<UserOption>(userResponse);

  const selectedBoPhan = watch('boPhan');

  const selectedRole = watch('vaiTro');

  const selectedManagerId = watch('managerId');

  // Lọc quản lý theo bộ phận đã chọn
  const filteredUsers = dataUser.filter((item) => String(item.boPhanId) === String(selectedBoPhan));

  const { mutate, isPending } = useMutation<unknown, Error, CreateUserPayload>({
    mutationFn: (values: CreateUserPayload) => {
      const formatValues: CreateUserPayload = {
        ...values,

        managerId: values.managerId == null ? null : Number(values.managerId),

        fullName: capitalizeFirstLetter(values.fullName),

        address: capitalizeFirstLetter(values.address ?? ''),
      };

      return createUser(formatValues);
    },

    onSuccess: () => {
      showAlert({
        type: 'success',
        message: 'Tạo tài khoản thành công',
      });

      queryClient.invalidateQueries({
        queryKey: ['dataUser'],
      });

      handleClose();
    },

    onError: (error) => {
      showAlert({
        type: 'error',
        message: error.message || 'Không thể tạo tài khoản',
      });
    },
  });

  const handleFormSubmit: SubmitHandler<CreateUserForm> = ({
    confirmPass,
    managerId,
    ...formData
  }) => {
    const payload: CreateUserPayload = {
      ...formData,

      managerId: managerId == null ? null : Number(managerId),
    };

    mutate(payload);
  };

  const renderPasswordField = (label: string, name: PasswordFieldName) => (
    <FormField label={label}>
      <TextField
        type={showPassword[name] ? 'text' : 'password'}
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
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => ({
                      ...current,
                      [name]: !current[name],
                    }))
                  }
                >
                  <Iconify icon={showPassword[name] ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
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
          {fields.map((field) => (
            <Fragment key={field.name}>
              <FormField label={field.label}>
                <TextField
                  type={field.name === 'brithday' ? 'date' : 'text'}
                  variant="standard"
                  sx={widthImport}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                  {...register(field.name)}
                  slotProps={
                    field.name === 'brithday'
                      ? {
                          inputLabel: {
                            shrink: true,
                          },
                        }
                      : undefined
                  }
                />
              </FormField>

              {field.name === 'userName' && (
                <>
                  <SelectWithAdd
                    label="Bộ phận"
                    // Sửa dataBp thành dataBoPhan
                    data={dataBoPhan}
                    value={isLoadingBoPhan ? '' : selectedBoPhan}
                    onChange={(value) => {
                      setValue('boPhan', String(value), {
                        shouldValidate: true,
                        shouldTouch: true,
                      });

                      // Đổi bộ phận thì bỏ quản lý cũ
                      setValue('managerId', null);
                    }}
                    onOpen={() => openModal('bp')}
                    error={errors.boPhan?.message}
                  />

                  <SelectWithAdd
                    label="Vai trò"
                    data={dataRole}
                    value={isLoadingRole ? '' : selectedRole}
                    onChange={(value) =>
                      setValue('vaiTro', String(value), {
                        shouldValidate: true,
                        shouldTouch: true,
                      })
                    }
                    onOpen={() => openModal('role')}
                    error={errors.vaiTro?.message}
                  />

                  <FormField label="Quản lý trực tiếp">
                    <Autocomplete<UserOption>
                      options={filteredUsers}
                      loading={isLoadingUser}
                      getOptionLabel={(option) => option.fullName ?? ''}
                      isOptionEqualToValue={(option, value) => option.userId === value.userId}
                      value={
                        filteredUsers.find((item) => item.userId === selectedManagerId) ?? null
                      }
                      onChange={(_, value) => {
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
                          error={!!errors.managerId}
                          helperText={errors.managerId?.message}
                        />
                      )}
                      disabled={!selectedBoPhan}
                    />
                  </FormField>

                  {renderPasswordField('Mật khẩu', 'pass')}

                  {renderPasswordField('Nhập lại mật khẩu', 'confirmPass')}
                </>
              )}
            </Fragment>
          ))}
        </DialogContent>

        <DialogActions>
          <Button type="button" color="inherit" onClick={handleClose} disabled={isPending}>
            Huỷ
          </Button>

          <Button type="submit" color="primary" variant="contained" disabled={isPending}>
            {isPending ? 'Đang tạo...' : 'Tạo'}
          </Button>
        </DialogActions>
      </form>

      <ModalManager open={open === 'bp'} handleClose={closeModal}>
        {open === 'bp' && <CreateBoPhan handleClose={closeModal} />}
      </ModalManager>

      <ModalManager open={open === 'role'} handleClose={closeModal}>
        {open === 'role' && <CreateRole handleClose={closeModal} />}
      </ModalManager>
    </>
  );
}
