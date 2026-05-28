import type { SubmitHandler } from 'react-hook-form';

import { object, string, boolean } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Grid from '@mui/material/GridLegacy';
import {
  Radio,
  Button,
  TextField,
  InputLabel,
  RadioGroup,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import { editDashboardLink } from 'src/apis/dashboardAdmin';

import { showAlert, capitalizeFirstLetter } from 'src/components/alert';

import { widthImport } from '../units';

import type { EditLinkForm, EditLinkProps } from './type';

const editSchema = object({
  title: string().required('Vui lòng nhập tiêu đề'),
  link: string().required('Vui lòng nhập đường link BI'),
  status: boolean(),
});

export function EditLink({ handleClose, rowSelect }: EditLinkProps) {  
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      title: rowSelect?.title ?? '',
      link: rowSelect?.link ?? '',
      status: rowSelect?.status ?? false,
    },
    resolver: yupResolver(editSchema),
    mode: 'onTouched',
  });

  const { mutate } = useMutation({
    mutationFn: (value: EditLinkForm) => {
      const formatValues = {
        ...value,
        id: rowSelect?.id, 
        title: capitalizeFirstLetter(value.title),
        status: value.status ? 1 : 0,
      };
      return editDashboardLink(formatValues);
      
    },
    onError: (error) => {
      showAlert(error);
    },
    onSuccess: () => {
      showAlert({ type: 'success', message: 'Đã cập nhật thành công' });
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ['dataDashboardAdmin'],
      });
    },
  });

  console.log();
  

  const handleFormSubmit: SubmitHandler<EditLinkForm> = (data) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <DialogTitle>Sửa Link Dashboard Admin </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center" justifyContent="flex-start" sx={{ mb: 1 }}>
          <Grid item xs={4}>
            <InputLabel>Tên báo cáo: </InputLabel>
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
            <InputLabel>Link báo cáo: </InputLabel>
          </Grid>
          <Grid item xs={8}>
            <TextField
              sx={{ ...widthImport }}
              variant="standard"
              error={!!errors.link}
              {...register('link')}
              helperText={errors.link?.message}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" justifyContent="flex-start" sx={{ mb: 1 }}>
          <Grid item xs={4}>
            <InputLabel>Trạng thái:</InputLabel>
          </Grid>
          <Grid item xs={8}>
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
          </Grid>
        </Grid>

        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            Huỷ
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </DialogContent>
    </form>
  );
}
