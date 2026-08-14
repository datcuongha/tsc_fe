import { object, string, boolean } from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Radio,
  Button,
  TextField,
  RadioGroup,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import { FormField } from 'src/components/form';

import { widthImport } from 'src/sections/invoice-it/utils';

import type { EditBpProps } from './type';

const editSchema = object({
  maBp: string().required('Không để trống mã bộ phận'),
  name: string().required('Không để trống tên bộ phận'),
  status: boolean(),
});

export function EditBp({ handleClose, rowSelect }: EditBpProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      maBp: rowSelect.maBp,
      name: rowSelect.name,
      status: rowSelect.status,
    },
    resolver: yupResolver(editSchema),
    mode: 'onTouched',
  });

  const fields = [
    { name: 'maBp', label: 'Mã bộ phận' },
    { name: 'name', label: 'Tên bộ phận' },
  ] as const;
  return (
    <form action="">
      <DialogTitle>Cập nhật</DialogTitle>
      <DialogContent>
        {fields.map((item, index) => (
          <FormField key={item.name} label={item.label}>
            <TextField
              variant="standard"
              sx={{ ...widthImport }}
              error={!!errors[item.name]}
              {...register(item.name)}
              helperText={errors[item.name]?.message}
            />
          </FormField>
        ))}

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
        <Button color="inherit" onClick={handleClose}>
          Huỷ
        </Button>
        <Button variant="contained" type="submit">
          Cập nhật
        </Button>
      </DialogActions>
    </form>
  );
}
