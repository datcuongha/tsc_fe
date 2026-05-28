import type { InferType } from 'yup';

import { object, string, boolean } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Radio,
  Button,
  MenuItem,
  TextField,
  RadioGroup,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import { editUser } from 'src/apis/user';
import { getDataRole } from 'src/apis/role';
import { getDataBp } from 'src/apis/boPhan';

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
});

type EditUserForm = InferType<typeof editSchema>;

export function EditUser({ handleClose, rowSelect }: EditUserProps) {
  const queryClient = useQueryClient();

  const { data: dataRole = [] } = useQuery<OptionType[]>({
    queryKey: ['role'],
    queryFn: getDataRole,
  });

  const { data: dataBoPhan = [] } = useQuery<OptionType[]>({
    queryKey: ['boPhan'],
    queryFn: getDataBp,
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
    },
    resolver: yupResolver(editSchema) as any,
    mode: 'onTouched',
  });

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
      };

      return editUser(payload);
    },

    onError: (error) => {
      showAlert(error);
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
    { name: 'fullName', label: 'Họ tên' },
    { name: 'userName', label: 'Tên đăng nhập' },
    { name: 'email', label: 'Email' },
    { name: 'phone', label: 'Số điện thoại' },
    { name: 'brithday', label: 'Ngày sinh' },
    { name: 'address', label: 'Địa chỉ' },
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
              InputLabelProps={f.name === 'brithday' ? { shrink: true } : undefined}
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
          value={watch('boPhan')}
          onChange={(val) =>
            setValue('boPhan', val, {
              shouldValidate: true,
            })
          }
          onOpen={() => {}}
          error={errors.boPhan?.message}
        />

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
