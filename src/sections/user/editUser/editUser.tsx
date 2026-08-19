import type { InferType } from 'yup';

import { object, string, number, boolean } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Radio,
  Button,
  TextField,
  RadioGroup,
  DialogTitle,
  Autocomplete,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import { getAllBp } from 'src/apis/boPhan';
import { getDataRole } from 'src/apis/role';
import { editUser, getAllUser } from 'src/apis/user';

import { FormField, SelectWithAdd } from 'src/components/form';
import { showAlert, capitalizeFirstLetter } from 'src/components/alert';

import type { OptionType, EditUserProps, EditUserPayload } from './type';

const editSchema = object({
  userName: string().required('Không để trống tên đăng nhập'),

  email: string().email('Email không đúng định dạng').required('Không được để trống email'),

  brithday: string().nullable().optional(),

  phone: string()
    .nullable()
    .optional()
    .test('is-number', 'Phải là số', (value) => {
      if (!value) return true;
      return /^\d+$/.test(value);
    }),

  fullName: string().required('Không được để trống họ tên'),

  address: string().nullable().optional(),

  status: boolean().nullable().optional(),

  vaiTro: string().required('Vui lòng chọn vai trò'),

  boPhan: string().required('Vui lòng chọn bộ phận'),

  managerId: number().nullable().optional(),
});

type EditUserForm = InferType<typeof editSchema>;

type UserOption = {
  userId: number;
  fullName: string;
  boPhanId?: number | null;
};

export function EditUser({ handleClose, rowSelect }: EditUserProps) {
  const queryClient = useQueryClient();

  const { data: dataRole = [] } = useQuery<OptionType[]>({
    queryKey: ['role'],
    queryFn: getDataRole,
  });

  const { data: dataBoPhan = [] } = useQuery<OptionType[]>({
    queryKey: ['boPhan'],
    queryFn: getAllBp,
  });

  const { data: dataUser = [] } = useQuery<UserOption[]>({
    queryKey: ['dataUser'],
    queryFn: getAllUser,
  });

  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditUserForm>({
    defaultValues: {
      fullName: rowSelect?.fullName ?? '',
      userName: rowSelect?.userName ?? '',
      email: rowSelect?.email ?? '',
      phone: rowSelect?.phone ?? '',
      brithday: rowSelect?.brithday ?? '',
      address: rowSelect?.address ?? '',
      status: !!rowSelect?.status,
      vaiTro: String(rowSelect?.vaiTroId ?? ''),
      boPhan: String(rowSelect?.boPhanId ?? ''),
      managerId: rowSelect?.managerId ?? null,
    },

    resolver: yupResolver(editSchema) as any,

    mode: 'onTouched',
  });

  const selectedBoPhan = watch('boPhan');
  const managerId = watch('managerId');

  const filteredUsers = dataUser.filter(
    (item) => String(item.boPhanId) === String(selectedBoPhan) && item.userId !== rowSelect.userId
  );

  const { mutate, isPending } = useMutation({
    mutationFn: (values: EditUserForm) => {
      const payload: EditUserPayload = {
        userId: rowSelect.userId,

        fullName: capitalizeFirstLetter(values.fullName),

        userName: values.userName,

        email: values.email,

        phone: values.phone ?? undefined,

        brithday: values.brithday ?? undefined,

        address: capitalizeFirstLetter(values.address ?? ''),

        status: values.status ? 1 : 0,

        vaiTro: values.vaiTro,

        boPhan: values.boPhan,

        managerId: values.managerId ?? null,
      };

      return editUser(payload);
    },

    onError: (error) => {
      showAlert({
        type: 'error',
        message: String(error),
      });
    },

    onSuccess: () => {
      showAlert({
        type: 'success',
        message: 'Đã cập nhật thành công',
      });

      handleClose();

      queryClient.invalidateQueries({
        queryKey: ['dataUser'],
      });
    },
  });

  const handleForSubmit = (data: EditUserForm) => {
    mutate(data);
  };

  const fields = [
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
  ] as const;

  return (
    <form onSubmit={handleSubmit(handleForSubmit)}>
      <DialogTitle>Cập nhật thông tin tài khoản</DialogTitle>

      <DialogContent>
        {fields.map((f) => (
          <FormField key={f.name} label={f.label}>
            <TextField
              fullWidth
              type={f.name === 'brithday' ? 'date' : 'text'}
              variant="standard"
              error={!!errors[f.name]}
              helperText={errors[f.name]?.message}
              {...register(f.name)}
              InputLabelProps={
                f.name === 'brithday'
                  ? {
                      shrink: true,
                    }
                  : undefined
              }
            />
          </FormField>
        ))}

        <SelectWithAdd
          label="Vai trò"
          data={dataRole}
          value={watch('vaiTro')}
          onChange={(val) =>
            setValue('vaiTro', val, {
              shouldValidate: true,
            })
          }
          onOpen={() => {}}
          error={errors.vaiTro?.message}
        />

        <SelectWithAdd
          label="Bộ phận"
          data={dataBoPhan}
          value={selectedBoPhan}
          onChange={(val) => {
            setValue('boPhan', val, {
              shouldValidate: true,
            });

            // Đổi bộ phận thì bỏ quản lý cũ
            setValue('managerId', null, {
              shouldValidate: true,
            });
          }}
          onOpen={() => {}}
          error={errors.boPhan?.message}
        />

        <FormField label="Quản lý trực tiếp">
          <Autocomplete<UserOption>
            options={filteredUsers}
            getOptionLabel={(option) => option.fullName ?? ''}
            value={filteredUsers.find((item) => item.userId === managerId) ?? null}
            onChange={(_, value) => {
              setValue('managerId', value ? value.userId : null, {
                shouldValidate: true,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                placeholder={selectedBoPhan ? 'Chọn quản lý trực tiếp' : 'Chọn bộ phận trước'}
                error={!!errors.managerId}
                helperText={errors.managerId?.message}
              />
            )}
            disabled={!selectedBoPhan}
          />
        </FormField>

        <FormField label="Trạng thái">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <RadioGroup
                row
                value={field.value ? 'true' : 'false'}
                onChange={(e) => field.onChange(e.target.value === 'true')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Hoạt động" />

                <FormControlLabel value="false" control={<Radio />} label="Ngưng hoạt động" />
              </RadioGroup>
            )}
          />
        </FormField>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Huỷ
        </Button>

        <Button type="submit" variant="contained" disabled={isPending}>
          {isPending ? 'Đang cập nhật...' : 'Xác nhận'}
        </Button>
      </DialogActions>
    </form>
  );
}
