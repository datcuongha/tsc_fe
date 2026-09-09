import type { InferType } from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  useForm,
  Controller,
} from 'react-hook-form';
import {
  object,
  string,
  number,
  boolean,
} from 'yup';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

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
import {
  editUser,
  getAllUser,
} from 'src/apis/user';

import {
  FormField,
  SelectWithAdd,
} from 'src/components/form';
import {
  showAlert,
  capitalizeFirstLetter,
} from 'src/components/alert';

import type {
  OptionType,
  EditUserProps,
  EditUserPayload,
} from './type';

const editSchema = object({
  userName: string()
    .trim()
    .required('Không để trống tên đăng nhập'),

  email: string()
    .trim()
    .email('Email không đúng định dạng')
    .required('Không được để trống email'),

  brithday: string()
    .nullable()
    .optional(),

  phone: string()
    .nullable()
    .optional()
    .test(
      'is-number',
      'Phải là số',
      (value) => {
        if (!value) return true;

        return /^\d+$/.test(value);
      }
    ),

  fullName: string()
    .trim()
    .required('Không được để trống họ tên'),

  address: string()
    .nullable()
    .optional(),

  status: boolean()
    .nullable()
    .optional(),

  vaiTro: string().required(
    'Vui lòng chọn vai trò'
  ),

  boPhan: string().required(
    'Vui lòng chọn bộ phận'
  ),

  managerId: number()
    .nullable()
    .optional(),
});

type EditUserForm =
  InferType<typeof editSchema>;

type UserOption = {
  userId: number;
  fullName: string;
  boPhanId?: number | null;
};

type ListResponse<T> = {
  content?: T[] | ListResponse<T>;
  data?: T[] | ListResponse<T>;
  items?: T[] | ListResponse<T>;
};

const extractArray = <T,>(
  value: unknown
): T[] => {
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

  if (
    response.content &&
    typeof response.content === 'object'
  ) {
    return extractArray<T>(response.content);
  }

  if (
    response.data &&
    typeof response.data === 'object'
  ) {
    return extractArray<T>(response.data);
  }

  if (
    response.items &&
    typeof response.items === 'object'
  ) {
    return extractArray<T>(response.items);
  }

  return [];
};

const getErrorMessage = (
  error: unknown
): string => {
  if (
    error &&
    typeof error === 'object' &&
    'message' in error
  ) {
    return String(
      (error as { message?: unknown }).message ??
        'Cập nhật thất bại'
    );
  }

  return String(
    error || 'Cập nhật thất bại'
  );
};

export function EditUser({
  handleClose,
  rowSelect,
}: EditUserProps) {
  const queryClient = useQueryClient();

  // ==========================================
  // LẤY DANH SÁCH VAI TRÒ
  // ==========================================
  const {
    data: roleResponse,
    isLoading: isLoadingRole,
  } = useQuery({
    queryKey: ['role'],
    queryFn: getDataRole,
  });

  // ==========================================
  // LẤY DANH SÁCH BỘ PHẬN
  // ==========================================
  const {
    data: boPhanResponse,
    isLoading: isLoadingBoPhan,
  } = useQuery({
    queryKey: ['boPhan'],
    queryFn: getAllBp,
  });

  // ==========================================
  // LẤY DANH SÁCH NGƯỜI DÙNG
  // ==========================================
  const {
    data: userResponse,
    isLoading: isLoadingUser,
  } = useQuery({
    queryKey: ['dataUser'],
    queryFn: getAllUser,
  });

  // Luôn đảm bảo dữ liệu là mảng
  const dataRole =
    extractArray<OptionType>(roleResponse);

  const dataBoPhan =
    extractArray<OptionType>(
      boPhanResponse
    );

  const dataUser =
    extractArray<UserOption>(userResponse);

  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditUserForm>({
    defaultValues: {
      fullName:
        rowSelect?.fullName ?? '',

      userName:
        rowSelect?.userName ?? '',

      email:
        rowSelect?.email ?? '',

      phone:
        rowSelect?.phone ?? '',

      brithday:
        rowSelect?.brithday ?? '',

      address:
        rowSelect?.address ?? '',

      status:
        Boolean(rowSelect?.status),

      vaiTro:
        String(
          rowSelect?.vaiTroId ?? ''
        ),

      boPhan:
        String(
          rowSelect?.boPhanId ?? ''
        ),

      managerId:
        rowSelect?.managerId == null
          ? null
          : Number(rowSelect.managerId),
    },

    resolver: yupResolver(
      editSchema
    ) as any,

    mode: 'onTouched',
  });

  const selectedBoPhan =
    watch('boPhan');

  const selectedRole =
    watch('vaiTro');

  const selectedManager =
    watch('managerId');

  // Lọc quản lý cùng bộ phận,
  // đồng thời loại chính tài khoản đang sửa
  const filteredUsers = dataUser.filter(
    (item) =>
      String(item.boPhanId) ===
        String(selectedBoPhan) &&
      Number(item.userId) !==
        Number(rowSelect.userId)
  );

  const {
    mutate,
    isPending,
  } = useMutation({
    mutationFn: (
      values: EditUserForm
    ) => {
      const payload: EditUserPayload = {
        userId: rowSelect.userId,

        fullName:
          capitalizeFirstLetter(
            values.fullName.trim()
          ),

        userName:
          values.userName.trim(),

        email:
          values.email.trim(),

        phone:
          values.phone?.trim() ||
          undefined,

        brithday:
          values.brithday ||
          undefined,

        address:
          capitalizeFirstLetter(
            values.address?.trim() ?? ''
          ),

        status:
          values.status ? 1 : 0,

        vaiTro:
          String(values.vaiTro),

        boPhan:
          String(values.boPhan),

        managerId:
          values.managerId == null
            ? null
            : Number(values.managerId),
      };

      return editUser(payload);
    },

    onSuccess: () => {
      showAlert({
        type: 'success',
        message:
          'Đã cập nhật thành công',
      });

      queryClient.invalidateQueries({
        queryKey: ['dataUser'],
      });

      handleClose();
    },

    onError: (error: unknown) => {
      showAlert({
        type: 'error',
        message:
          getErrorMessage(error),
      });
    },
  });

  const handleFormSubmit = (
    data: EditUserForm
  ) => {
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
    <form
      onSubmit={handleSubmit(
        handleFormSubmit
      )}
    >
      <DialogTitle>
        Cập nhật thông tin tài khoản
      </DialogTitle>

      <DialogContent>
        {fields.map((field) => (
          <FormField
            key={field.name}
            label={field.label}
          >
            <TextField
              fullWidth
              type={
                field.name === 'brithday'
                  ? 'date'
                  : 'text'
              }
              variant="standard"
              error={
                !!errors[field.name]
              }
              helperText={
                errors[field.name]
                  ?.message
              }
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
        ))}

        <SelectWithAdd
          label="Vai trò"
          data={dataRole}
          value={
            isLoadingRole
              ? ''
              : selectedRole
          }
          onChange={(value) =>
            setValue(
              'vaiTro',
              String(value),
              {
                shouldValidate: true,
                shouldTouch: true,
              }
            )
          }
          onOpen={() => {}}
          showAddButton={false}
          error={
            errors.vaiTro?.message
          }
        />

        <SelectWithAdd
          label="Bộ phận"
          data={dataBoPhan}
          value={
            isLoadingBoPhan
              ? ''
              : selectedBoPhan
          }
          onChange={(value) => {
            setValue(
              'boPhan',
              String(value),
              {
                shouldValidate: true,
                shouldTouch: true,
              }
            );

            // Khi đổi bộ phận,
            // xóa quản lý đã chọn trước đó
            setValue(
              'managerId',
              null,
              {
                shouldValidate: true,
              }
            );
          }}
          onOpen={() => {}}
          showAddButton={false}
          error={
            errors.boPhan?.message
          }
        />

        <FormField label="Quản lý trực tiếp">
          <Autocomplete<UserOption>
            options={filteredUsers}
            loading={isLoadingUser}
            getOptionLabel={(option) =>
              option.fullName ?? ''
            }
            isOptionEqualToValue={(
              option,
              value
            ) =>
              Number(option.userId) ===
              Number(value.userId)
            }
            value={
              filteredUsers.find(
                (item) =>
                  Number(item.userId) ===
                  Number(selectedManager)
              ) ?? null
            }
            onChange={(_, value) => {
              setValue(
                'managerId',
                value
                  ? Number(value.userId)
                  : null,
                {
                  shouldValidate: true,
                  shouldTouch: true,
                }
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                placeholder={
                  selectedBoPhan
                    ? 'Chọn quản lý trực tiếp'
                    : 'Chọn bộ phận trước'
                }
                error={
                  !!errors.managerId
                }
                helperText={
                  errors.managerId
                    ?.message
                }
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
                value={
                  field.value
                    ? 'true'
                    : 'false'
                }
                onChange={(event) =>
                  field.onChange(
                    event.target.value ===
                      'true'
                  )
                }
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Hoạt động"
                />

                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="Ngưng hoạt động"
                />
              </RadioGroup>
            )}
          />
        </FormField>
      </DialogContent>

      <DialogActions>
        <Button
          type="button"
          onClick={handleClose}
          color="inherit"
          disabled={isPending}
        >
          Huỷ
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
        >
          {isPending
            ? 'Đang cập nhật...'
            : 'Xác nhận'}
        </Button>
      </DialogActions>
    </form>
  );
}