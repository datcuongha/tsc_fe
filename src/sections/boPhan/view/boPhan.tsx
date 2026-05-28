import type { SubmitHandler } from 'react-hook-form';

import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Grid from '@mui/material/GridLegacy';
import {
  Button,
  TextField,
  InputLabel,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { createBp } from 'src/apis/boPhan';

import { showAlert, capitalizeFirstLetter } from 'src/components/alert';

import { widthImport } from 'src/sections/invoice-it/utils';

import type { CreateBpForm, CreateBpProps } from './type';

const createBpSchema = object({
  name: string().required('Nhập tên bộ phận'),
});
export function BoPhan({ handleClose }: CreateBpProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(createBpSchema),
    mode: 'onTouched',
  });

  const { mutate } = useMutation({
    mutationFn: (values: CreateBpForm) => {
      const formatValues = {
        ...values,
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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <DialogTitle>Tạo Bộ phận</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center" justifyContent="flex-start" sx={{ mb: 1 }}>
          <Grid item xs={4}>
            <InputLabel>Tên Bộ phận</InputLabel>
          </Grid>
          <Grid item xs={8}>
            <TextField
              sx={{ ...widthImport }}
              variant="standard"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
        </Grid>
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
