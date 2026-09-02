import type { SubmitHandler } from 'react-hook-form';

import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TextField, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { createPq } from 'src/apis/phanQuyen';

import { FormField } from 'src/components/form';
import { ButtonGroup } from 'src/components/button';
import { showAlert, capitalizeFirstLetterFirst } from 'src/components/alert';

import { widthImport } from 'src/sections/invoice-it/utils';

import type { CreatePhanQuyenForm, CreatePhanQuyenProps } from './type';

const createPhanQuyenSchema = object({
  code: string().required('Không để trống mã phân quyền'),
  name: string().required('Không để trống tên phân quyền'),
  module: string().required('Không để trống module phân quyền'),
});

export function CreatePhanQuyen({ handleClose }: CreatePhanQuyenProps) {
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: '',
      name: '',
      module: '',
    },
    resolver: yupResolver(createPhanQuyenSchema),
    mode: 'onTouched',
  });

  type FieldName = keyof CreatePhanQuyenForm;
  const fields: { name: FieldName; label: string }[] = [
    { name: 'code', label: 'Mã quyền' },
    { name: 'name', label: 'Tên quyền' },
    { name: 'module', label: 'Module' },
  ];

  const { mutate, isPending } = useMutation({
    mutationFn: (value: CreatePhanQuyenForm) => {
      const forrmatValue = {
        ...value,
        code: value.code.trim().toUpperCase(),
        name: capitalizeFirstLetterFirst(value.name),
        module: value.module.trim().toUpperCase(),
      };
      return createPq(forrmatValue);
    },
    onSuccess: () => {
      showAlert({
        type: 'success',
        message:'Thành công',
      });

      queryClient.invalidateQueries({
        queryKey: ['dataPhanQuyen'],
      });

      handleClose();
    },
    onError: (err) => {
      showAlert({
        type: 'error',
        message: String(err),
      });
    },
  });

  const handleFormSubmit: SubmitHandler<CreatePhanQuyenForm> = (data) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <DialogTitle>Tạo phân quyền</DialogTitle>
      <DialogContent>
        {fields.map((f, index) => (
          <FormField key={f.name} label={f.label}>
            <TextField
              variant="standard"
              sx={{ ...widthImport }}
              error={!!errors[f.name]}
              {...register(f.name)}
              helperText={errors[f.name]?.message}
            />
          </FormField>
        ))}
      </DialogContent>
      <DialogActions>
        <ButtonGroup
          handleClose={handleClose}
          showSubmit
          submitLabel="Tạo"
          isPendingSubmit={isPending}
        />
      </DialogActions>
    </form>
  );
}
