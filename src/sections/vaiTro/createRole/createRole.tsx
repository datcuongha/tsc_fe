import type { SubmitHandler } from 'react-hook-form';

import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Table,
  Paper,
  Button,
  TableRow,
  Checkbox,
  TextField,
  TableHead,
  TableCell,
  TableBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
} from '@mui/material';

import { creatRole } from 'src/apis/role';
import { getAllPq } from 'src/apis/phanQuyen';

import { FormField } from 'src/components/form';
import { LoadingBackdrop } from 'src/components/loading';
import { showAlert, capitalizeFirstLetter } from 'src/components/alert';

import { widthImport } from '../../invoice-it/utils';

import type { Permission, CreateRoleFrom, CreateRoleProps } from './type';

const createScheme = object({
  name: string().required('Vui lòng nhập vai trò'),
  dienGiai: string(),
});

export function CreateRole({ handleClose }: CreateRoleProps) {
  const queryClient = useQueryClient();

  const normalizeCode = (value: unknown): string =>
    String(value ?? '')
      .trim()
      .toUpperCase()
      .replace(/[.\-:/\s]+/g, '_');

  const actions = [
    { key: 'view', label: 'Xem', aliases: ['VIEW', 'XEM'] },
    { key: 'create', label: 'Thêm', aliases: ['CREATE', 'ADD', 'TAO', 'THEM'] },
    { key: 'update', label: 'Sửa', aliases: ['UPDATE', 'EDIT', 'SUA'] },
    { key: 'delete', label: 'Xóa', aliases: ['DELETE', 'REMOVE', 'XOA'] },
    { key: 'approve', label: 'Duyệt', aliases: ['APPROVE', 'DUYET'] },
    { key: 'reject', label: 'Trả lại', aliases: ['REJECT', 'RETURN', 'TRA_LAI'] },
  ] as const;

  const matchPermissionAction = (permissionCode: unknown, aliases: readonly string[]): boolean => {
    const code = normalizeCode(permissionCode);
    const codeParts = code.split('_');

    return aliases.some((aliasValue) => {
      const alias = normalizeCode(aliasValue);

      return (
        code === alias ||
        code.startsWith(`${alias}_`) ||
        code.endsWith(`_${alias}`) ||
        codeParts.includes(alias)
      );
    });
  };

  const { data: permissions = [], isLoading } = useQuery<Permission[]>({
    queryKey: ['dataPq'],
    queryFn: getAllPq,
  });

  useEffect(() => {
    setSelectedPermissions(permissions?.map((permission) => permission.code) ?? []);
  }, [permissions]);

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // toggle checkbox
  const handleToggle = (code: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]
    );
  };

  const handleToggleAll = (modulePermissions: Permission[]) => {
    const moduleCodes = modulePermissions.map((permission) => permission.code);

    const isAllSelected = moduleCodes.every((code) => selectedPermissions.includes(code));

    setSelectedPermissions((prev) => {
      if (isAllSelected) {
        // Bỏ chọn các quyền thuộc module hiện tại
        return prev.filter((code) => !moduleCodes.includes(code));
      }

      // Chọn tất cả và tránh code bị trùng
      return [...new Set([...prev, ...moduleCodes])];
    });
  };

  // group theo module
  const grouped = permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }

    acc[permission.module].push(permission);
    return acc;
  }, {});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      dienGiai: '',
    },
    resolver: yupResolver(createScheme),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateRoleFrom) =>
      creatRole({
        name: capitalizeFirstLetter(values.name),
        dienGiai: capitalizeFirstLetter(values.dienGiai ?? ''),
        phanQuyen: selectedPermissions,
      }),

    onError: (error: any) => {
      showAlert({
        type: 'error',
        message: error?.message ?? 'Tạo vai trò thất bại',
      });
    },

    onSuccess: () => {
      handleClose();

      showAlert({
        type: 'success',
        message: 'Tạo vai trò thành công',
      });

      queryClient.invalidateQueries({
        queryKey: ['dataRole'],
      });
    },
  });

  const handleFormSubmit: SubmitHandler<CreateRoleFrom> = (data) => {
    mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <DialogTitle>Tạo vai trò</DialogTitle>
      <DialogContent>
        <FormField label="Vai trò">
          <TextField
            variant="standard"
            sx={{ ...widthImport }}
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </FormField>

        <FormField label="Mô tả">
          <TextField
            variant="standard"
            sx={{ ...widthImport }}
            {...register('dienGiai')}
            error={!!errors.dienGiai}
            helperText={errors.dienGiai?.message}
          />
        </FormField>

        {/* bảng permission */}
        <TableContainer
          component={Paper}
          sx={{
            mt: 2,
            maxHeight: 550,
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    minWidth: 150,
                    fontWeight: 'bold',
                  }}
                >
                  Module
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: 80,
                    fontWeight: 'bold',
                  }}
                >
                  Tất cả
                </TableCell>

                {actions.map((action) => (
                  <TableCell
                    key={action.key}
                    align="center"
                    sx={{
                      width: 90,
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {action.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {Object.entries(grouped).map(([module, modulePermissions]) => {
                const moduleCodes = modulePermissions
                  .map((permission) => normalizeCode(permission.code))
                  .filter(Boolean);

                const selectedCount = moduleCodes.filter((code) =>
                  selectedPermissions.includes(code)
                ).length;

                const isAllSelected =
                  moduleCodes.length > 0 && selectedCount === moduleCodes.length;

                const isPartiallySelected = selectedCount > 0 && selectedCount < moduleCodes.length;

                return (
                  <TableRow key={module} hover>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {module}
                    </TableCell>

                    <TableCell align="center">
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isPartiallySelected}
                        onChange={() => handleToggleAll(modulePermissions)}
                      />
                    </TableCell>

                    {actions.map((action) => {
                      const permission = modulePermissions.find((item) =>
                        matchPermissionAction(item.code, action.aliases)
                      );

                      return (
                        <TableCell key={action.key} align="center">
                          {permission ? (
                            <Checkbox
                              checked={selectedPermissions.includes(normalizeCode(permission.code))}
                              onChange={() => handleToggle(permission.code)}
                            />
                          ) : (
                            <span
                              style={{
                                color: '#bbb',
                              }}
                            >
                              —
                            </span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}

              {!isLoading && Object.keys(grouped).length === 0 && (
                <TableRow>
                  <TableCell colSpan={actions.length + 2} align="center">
                    Chưa có dữ liệu phân quyền
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleClose}>
          Huỷ
        </Button>
        <Button type="submit" color="primary" variant="contained">
          Tạo
        </Button>
      </DialogActions>

      <LoadingBackdrop open={isPending} message="Đang xử lý, vui lòng chờ..." />
    </form>
  );
}
