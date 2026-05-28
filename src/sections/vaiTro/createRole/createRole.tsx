import type { SubmitHandler } from 'react-hook-form';

import { useState } from 'react';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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

import { FormField } from 'src/components/form';
import { showAlert, capitalizeFirstLetter } from 'src/components/alert';

import { widthImport } from '../../invoice-it/utils';

import type { CreateRoleFrom, CreateRoleProps } from './type';

const createScheme = object({
  name: string().required('Vui lòng nhập vai trò'),
  dienGiai: string(),
});

export function CreateRole({ handleClose }: CreateRoleProps) {
  const queryClient = useQueryClient();
  const actions = ['view', 'create', 'update', 'delete'];

  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    // toggle checkbox
  const handleToggle = (code: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(code)
        ? prev.filter((p) => p !== code)
        : [...prev, code]
    );
  };
  
  // group theo module
  const grouped = permissions.reduce((acc: any, cur: any) => {
    if (!acc[cur.module]) acc[cur.module] = [];
    acc[cur.module].push(cur);
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

  const { mutate } = useMutation({
    mutationFn: (values: CreateRoleFrom) => {
      const formatValue = {
        ...values,
        name: capitalizeFirstLetter(values.name),
        dienGiai: capitalizeFirstLetter(values.dienGiai ?? ''),
      };
      return creatRole(formatValue);
    },
    onError: (error: any) => {
      showAlert({ type: 'error', message: error });
    },
    onSuccess: () => {
      handleClose();
      showAlert({ type: 'success', message: 'Thành công' });
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
        <TableContainer component={Paper} sx={{mt:2}}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Module</TableCell>
                {actions.map((a) => (
                  <TableCell key={a} align="center">
                    {a.toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {Object.keys(grouped).map((module) => (
                <TableRow key={module}>
                  <TableCell>{module}</TableCell>

                  {actions.map((action) => {
                    const code = `${module}.${action}`;

                    const exist = grouped[module].find((p: any) => p.code === code);

                    return (
                      <TableCell key={action} align="center">
                        {exist && (
                          <Checkbox
                            checked={selectedPermissions.includes(code)}
                            onChange={() => handleToggle(code)}
                          />
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
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
    </form>
  );
}
