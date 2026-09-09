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

import { getAllPq } from 'src/apis/phanQuyen';
import { editRole, vaiTroPhanQuyen, getVaiTroPhanQuyen } from 'src/apis/role';

import { FormField } from 'src/components/form';
import { showAlert, capitalizeFirstLetter } from 'src/components/alert';

import { widthImport } from '../../invoice-it/utils';

import type { Permission, EditRoleFrom, EditRoleProps, RolePermissionDetail } from './type';

// ----------------------------------------------------------------------

const editScheme = object({
  name: string().required('Vui lòng nhập vai trò'),

  // Diễn giải không bắt buộc
  dienGiai: string(),
});

// ----------------------------------------------------------------------

const normalizeCode = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[.\-:/\s]+/g, '_');

const actions = [
  { key: 'view', label: 'Xem', aliases: ['VIEW', 'XEM'] },
  { key: 'create', label: 'Tạo', aliases: ['CREATE', 'ADD', 'TAO', 'THEM','PIVOT'] },
  { key: 'update', label: 'Sửa', aliases: ['UPDATE', 'EDIT', 'SUA'] },
  { key: 'delete', label: 'Xóa', aliases: ['DELETE', 'REMOVE', 'XOA'] },
  { key: 'approve', label: 'Duyệt', aliases: ['APPROVE', 'DUYET'] },
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

// ----------------------------------------------------------------------

export function EditRole({ rowSelect, handleClose }: EditRoleProps) {
  const queryClient = useQueryClient();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // ====================================================
  // LẤY TOÀN BỘ QUYỀN TRONG HỆ THỐNG
  // ====================================================

  const { data: permissions = [], isLoading: isLoadingPermissions } = useQuery<Permission[]>({
    queryKey: ['dataPq'],
    queryFn: getAllPq,
  });

  // ====================================================
  // LẤY QUYỀN ĐÃ GÁN CHO VAI TRÒ
  // ====================================================

  const { data: roleDetail, isLoading: isLoadingRoleDetail } = useQuery<RolePermissionDetail>({
    queryKey: ['vaiTroPhanQuyen', rowSelect.id],

    queryFn: () => getVaiTroPhanQuyen(rowSelect.id),

    enabled: Boolean(rowSelect.id),
  });

  // ====================================================
  // ĐÁNH DẤU CÁC QUYỀN ĐÃ GÁN
  // ====================================================

  useEffect(() => {
    if (!roleDetail?.phanQuyen) {
      setSelectedPermissions([]);

      return;
    }

    const permissionCodes = roleDetail.phanQuyen
      .map((permission) => normalizeCode(permission.code))
      .filter(Boolean);

    setSelectedPermissions([...new Set(permissionCodes)]);
  }, [roleDetail]);

  // ====================================================
  // NHÓM TOÀN BỘ QUYỀN THEO MODULE
  // ====================================================

  const groupedPermissions = permissions.reduce<Record<string, Permission[]>>(
    (result, permission) => {
      const moduleName = String(permission.module ?? 'KHÁC').trim() || 'KHÁC';

      if (!result[moduleName]) {
        result[moduleName] = [];
      }

      result[moduleName].push(permission);

      return result;
    },
    {}
  );

  // ====================================================
  // CHỌN/BỎ MỘT QUYỀN
  // ====================================================

  const handleToggle = (code: string) => {
    const normalizedCode = normalizeCode(code);

    setSelectedPermissions((previous) =>
      previous.includes(normalizedCode)
        ? previous.filter((item) => item !== normalizedCode)
        : [...previous, normalizedCode]
    );
  };

  // ====================================================
  // CHỌN/BỎ TOÀN BỘ QUYỀN CỦA MODULE
  // ====================================================

  const handleToggleAll = (modulePermissions: Permission[]) => {
    const moduleCodes = modulePermissions
      .map((permission) => normalizeCode(permission.code))
      .filter(Boolean);

    setSelectedPermissions((previous) => {
      const isAllSelected =
        moduleCodes.length > 0 && moduleCodes.every((code) => previous.includes(code));

      if (isAllSelected) {
        return previous.filter((code) => !moduleCodes.includes(code));
      }

      return [...new Set([...previous, ...moduleCodes])];
    });
  };

  // ====================================================
  // FORM
  // Giữ nguyên cách hiện tại để không lỗi Yup
  // ====================================================

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: rowSelect.name,
      dienGiai: rowSelect.dienGiai ?? '',
    },

    resolver: yupResolver(editScheme),
  });

  // ====================================================
  // CẬP NHẬT VAI TRÒ VÀ PHÂN QUYỀN
  // ====================================================
  
  const editMutation = useMutation({
    mutationFn: async (values: EditRoleFrom) => {
      // Cập nhật thông tin vai trò
      await editRole({
        id: rowSelect.id,

        name: capitalizeFirstLetter(values.name),

        dienGiai: capitalizeFirstLetter(values.dienGiai ?? ''),
      });
      
      // Cập nhật danh sách phân quyền
      return vaiTroPhanQuyen({
        vaiTroId: rowSelect.id,
        phanQuyen: selectedPermissions,
      });
    },

    onError: (error) => {
      showAlert({
        type: 'error',

        message: error instanceof Error ? error.message : String(error),
      });
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['dataRole'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['dataPq'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['vaiTroPhanQuyen', rowSelect.id],
        }),
      ]);

      showAlert({
        type: 'success',
        message: 'Cập nhật vai trò và phân quyền thành công',
      });

      handleClose();
    },
  });

  const handleFormSubmit: SubmitHandler<EditRoleFrom> = (formData) => {
    editMutation.mutate(formData);
  };

  const loading = isLoadingPermissions || isLoadingRoleDetail || editMutation.isPending;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <DialogTitle>Cập nhật vai trò</DialogTitle>

      <DialogContent>
        <FormField label="Vai trò">
          <TextField
            variant="standard"
            sx={{ ...widthImport }}
            {...register('name')}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
        </FormField>

        <FormField label="Mô tả">
          <TextField
            variant="standard"
            sx={{ ...widthImport }}
            {...register('dienGiai')}
            error={Boolean(errors.dienGiai)}
            helperText={errors.dienGiai?.message}
          />
        </FormField>

        <TableContainer
          component={Paper}
          sx={{
            mt: 3,
            maxHeight: 550,
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 150, fontWeight: 'bold' }}>Module</TableCell>
                <TableCell align="center" sx={{ width: 80, fontWeight: 'bold' }}>
                  Tất cả
                </TableCell>

                {actions.map((action) => (
                  <TableCell
                    key={action.key}
                    align="center"
                    sx={{ width: 90, fontWeight: 'bold', whiteSpace: 'nowrap' }}
                  >
                    {action.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {Object.entries(groupedPermissions).map(([moduleName, modulePermissions]) => {
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
                  <TableRow key={moduleName} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{moduleName}</TableCell>

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
                            <span style={{ color: '#bbb' }}>—</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}

              {!loading && permissions.length === 0 && (
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
        <Button
          type="button"
          color="inherit"
          onClick={handleClose}
          disabled={editMutation.isPending}
        >
          Huỷ
        </Button>

        <Button type="submit" color="primary" variant="contained" disabled={loading}>
          {editMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
      </DialogActions>

      {/* <LoadingBackdrop open={loading} /> */}
    </form>
  );
}
