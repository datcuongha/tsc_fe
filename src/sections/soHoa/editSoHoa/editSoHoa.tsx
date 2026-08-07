import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';

import { TextField, DialogTitle, DialogContent } from '@mui/material';

import { getAllBp } from 'src/apis/boPhan';
import { getAllDmLoaiVb } from 'src/apis/danhMuc';

import { useModal } from 'src/components/modal';
import { FormField, SelectWithAdd } from 'src/components/form';

import type { EditSoHoaProps } from './type';

const editSchemeSoHoa = object({
  loaiVb: string().required('Không để trống loại văn bản'),
  soVb: string().required('Không để trống số văn bản'),
  ngayVb: string().required('Không để trống ngày văn bản'),
  noiDung: string().required('Không để trống nội dung'),
});

export function EditSoHoa({ handleClose, rowSelect }: EditSoHoaProps) {
  console.log(rowSelect);

  const { open, data, openModal, closeModal } = useModal();
  const { data: dataBp = [] } = useQuery({
    queryKey: ['dataBp'],
    queryFn: getAllBp,
  });

  const { data: dataDmLoaiVb = [] } = useQuery({
    queryKey: ['dataDmLoaiVb'],
    queryFn: getAllDmLoaiVb,
  });
  console.log(rowSelect);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      loaiVb: String(rowSelect?.dmLoaiVbId ?? ''),
      soVb: rowSelect?.soVb ?? '',
      ngayVb: rowSelect?.ngayVb ?? '',
      noiDung: rowSelect?.noiDung ?? '',
    },
    resolver: yupResolver(editSchemeSoHoa),
    mode: 'onTouched',
  });

  const fields = [
    { name: 'soVb', label: 'Số văn bản' },
    { name: 'ngayVb', label: 'Ngày văn bản' },
    { name: 'noiDung', label: 'Nội dung' },
  ] as const;
  return (
    <form action="">
      <DialogTitle>Cập nhật tài liệu số hoá</DialogTitle>

      <DialogContent>
        <SelectWithAdd
          label="Loại văn bản"
          data={dataDmLoaiVb}
          value={watch('loaiVb')}
          onChange={(val) => setValue('loaiVb', val, { shouldValidate: true })}
          onOpen={() => openModal('loaiVb')}
          error={errors.loaiVb?.message}
          showAddButton={false}
        />
        {fields.map((item) => (
          <FormField key={item.name} label={item.label}>
            <TextField
              fullWidth
              type={item.name === 'ngayVb' ? 'date' : 'text'}
              variant="standard"
              error={!!errors[item.name]}
              helperText={errors[item.name]?.message}
              {...register(item.name)}
              //   InputLabelProps={f.name === 'brithday' ? { shrink: true } : undefined}
            />
          </FormField>
        ))}
      </DialogContent>
    </form>
  );
}
