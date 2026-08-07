import type { SubmitHandler } from 'react-hook-form';

import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { createBp } from 'src/apis/boPhan';

import { FormField } from 'src/components/form';
import { showAlert, capitalizeFirstLetter } from 'src/components/alert';

import { widthImport } from 'src/sections/invoice-it/utils';

import type { CreateBpForm, CreateBpProps } from './type';

const createBpSchema = object({
  maBp: string().required('Không để trống mã bộ phận'),
  name: string().required('Không để trống tên bộ phận'),
});
export function CreateBoPhan({ handleClose }: CreateBpProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      maBp: '',
      name: '',
    },
    resolver: yupResolver(createBpSchema),
    mode: 'onTouched',
  });

  const { mutate } = useMutation({
    mutationFn: (values: CreateBpForm) => {
      const formatValues = {
        ...values,
        maBp: values.maBp.toLocaleUpperCase(),
        name: capitalizeFirstLetter(values.name),
      };
      return createBp(formatValues);
    },
    onError: (error: any) => {
      showAlert({
        message: error,
        type: 'error',
      });
    },
    onSuccess: () => {
      showAlert({ type: 'success', message: 'Thành công' });
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ['dataBp'],
      });
    },
  });

  const handleFormSubmit: SubmitHandler<CreateBpForm> = (data) => {
    mutate(data);
  };

  type FieldName = keyof CreateBpForm;
  const fields: { name: FieldName; label: string }[] = [
    { name: 'maBp', label: 'Mã bộ phận' },
    { name: 'name', label: 'Tên bộ phận' },
  ];
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <DialogTitle>Tạo Bộ phận</DialogTitle>
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
