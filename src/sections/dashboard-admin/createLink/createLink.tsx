import type { SubmitHandler} from 'react-hook-form';

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

import { createDashboardLink } from 'src/apis/dashboardAdmin';

import { showAlert, capitalizeFirstLetter } from 'src/components/alert';

import { widthImport } from 'src/sections/invoice-it/utils';

import type { createLinkProps, CreateDashboardAdminLink } from './type';

const createLinkSchema = object({
  title: string().required('Nhập tên báo cáo'),
  link: string().required('Nhập link báo cáo BI'),
});

export function CreateLink({ handleClose }: createLinkProps) {
  const queryClient = useQueryClient();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      title: '',
      link: '',
    },
    resolver: yupResolver(createLinkSchema),
    mode: 'onTouched',
  });

  const { mutate } = useMutation({
    mutationFn: (values: CreateDashboardAdminLink) => {
      const forrmatValues = {
        ...values,
        title: capitalizeFirstLetter(values.title),
      };
      return createDashboardLink(forrmatValues);
    },
    onError: (error) => {
      showAlert(error);
    },
    onSuccess: () => {
      showAlert({ message: 'Thành công', type: 'success' });
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ['dataDashboardAdmin'],
      });
    },
  });

  const handleFormSubmit: SubmitHandler<CreateDashboardAdminLink> = (data ) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <DialogTitle>Tạo Link Dashboard Admin</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center" justifyContent="flex-start" sx={{ mb: 1 }}>
          <Grid item xs={4}>
            <InputLabel> Tên báo cáo: </InputLabel>
          </Grid>

          <Grid item xs={8}>
            <TextField
              variant="standard"
              sx={{ ...widthImport }}
              error={!!errors.title}
              {...register('title')}
              helperText={errors.title?.message}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" justifyContent="flex-start" sx={{ mb: 1 }}>
          <Grid item xs={4}>
            <InputLabel> Link báo cáo: </InputLabel>
          </Grid>

          <Grid item xs={8}>
            <TextField
              variant="standard"
              sx={{ ...widthImport }}
              error={!!errors.link}
              {...register('link')}
              helperText={errors.link?.message}
            />
          </Grid>
        </Grid>

        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            Huỷ
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Tạo
          </Button>
        </DialogActions>
      </DialogContent>
    </form>
  );
}
