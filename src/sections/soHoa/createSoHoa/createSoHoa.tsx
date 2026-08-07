import type { SubmitHandler } from 'react-hook-form';

import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Button, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { getAllBp } from 'src/apis/boPhan';
import { createSoHoa } from 'src/apis/soHoa';
import { getAllDmLoaiVb } from 'src/apis/danhMuc';

import { useModal, ModalManager } from 'src/components/modal';
import { FormField, SelectWithAdd } from 'src/components/form';
import { showAlert, capitalizeFirstLetterFirst } from 'src/components/alert';

import { widthImport } from 'src/sections/invoice-it/utils';
import { CreateBoPhan } from 'src/sections/boPhan/createBp';

import type { FilterDataBp, CreateSoHoaProps, CreataSoHoaPayload } from './type';

const createSchema = object({
  parentId: string(),
  loaiVb: string().required('Vui lòng nhập loại văn bản'),
  soVb: string(),
  soVbName: string(),
  ngayVb: string().required('Vui chọn ngày văn bản'),
  noiDung: string().required('Vui lòng nhập nội dung văn bản'),
  ngayKy: string(),
  boPhan: string(),
  maPhi: string(),
  hinhThucThanhToan: string(),
});

export function CreateSoHoa({ handleClose, data }: CreateSoHoaProps) {
  const dataLoaiVB = data.map((item) => ({
    id: item.id,
    name: item.soVb,
  }));
  const queryClient = useQueryClient();
  const { open, closeModal, openModal } = useModal();

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      parentId: '',
      loaiVb: '',
      soVb: '',
      soVbName: '',
      ngayVb: '',
      noiDung: '',
      ngayKy: '',
      boPhan: '',
    },
    resolver: yupResolver(createSchema),
    mode: 'onTouched',
  });

  const { data: dataBp = [] } = useQuery<FilterDataBp[]>({
    queryKey: ['dataBp'],
    queryFn: getAllBp,
  });

  const { data: dataDmLoaiVb = [] } = useQuery({
    queryKey: ['dataDmLoaiVb'],
    queryFn: getAllDmLoaiVb,
  });

  const { mutate } = useMutation({
    mutationFn: (value: CreataSoHoaPayload) => {
      const formatValue = {
        ...value,
        noiDung: capitalizeFirstLetterFirst(value.noiDung),
      };
      return createSoHoa(formatValue);
    },
    onError: (error) => {
      showAlert({ type: 'error', message: String(error) });
    },
    onSuccess: () => {
      showAlert({ type: 'success', message: 'Thành công' });
      handleClose();
      queryClient.invalidateQueries({
        queryKey: ['dataSoHoa'],
      });
    },
  });

  const handleFormSubmit: SubmitHandler<CreataSoHoaPayload> = (payload) => {
    mutate(payload);
  };
  const isPhieuDeXuat = Number(watch('loaiVb')) === 3;

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Tạo báo cáo</DialogTitle>
        <DialogContent>
          <SelectWithAdd
            label="Thuộc loại văn bản"
            data={dataLoaiVB}
            value={watch('parentId')}
            onChange={(val) => setValue('parentId', val, { shouldValidate: true })}
            onOpen={() => openModal('parentId')}
            showAddButton={false}
            required={false}
          />
          <SelectWithAdd
            label="Loại văn bản"
            data={dataDmLoaiVb}
            value={watch('loaiVb')}
            onChange={(val) => setValue('loaiVb', val, { shouldValidate: true })}
            onOpen={() => openModal('loaiVb')}
            error={errors.loaiVb?.message}
            showAddButton={false}
          />

          {!isPhieuDeXuat && (
            <FormField label="Số văn bản">
              <TextField
                variant="standard"
                sx={widthImport}
                {...register('soVb')}
                error={!!errors.soVb}
                helperText={errors.soVb?.message}
              />
            </FormField>
          )}
          {/* {isPhieuDeXuat && (
            <>
              <SelectWithAdd
                label="Mã phí"
                data={dataMaPhi}
                value={watch('maPhi')}
                onChange={(val) =>
                  setValue('maPhi', val, {
                    shouldValidate: true,
                  })
                }
                showAddButton={false}
              />

              <SelectWithAdd
                label="Hình thức thanh toán"
                data={[
                  {
                    id: 'tm',
                    name: 'Tiền mặt',
                  },
                  {
                    id: 'ck',
                    name: 'Chuyển khoản',
                  },
                ]}
                value={watch('hinhThucThanhToan')}
                onChange={(val) =>
                  setValue('hinhThucThanhToan', val, {
                    shouldValidate: true,
                  })
                }
                showAddButton={false}
              />
            </>
          )} */}

          <FormField label="Ngày văn bản">
            <TextField
              type="date"
              variant="standard"
              sx={widthImport}
              error={!!errors.ngayVb}
              {...register('ngayVb')}
              helperText={errors.ngayVb?.message}
            />
          </FormField>

          <FormField label="Nội dung">
            <TextField
              variant="standard"
              sx={widthImport}
              error={!!errors.noiDung}
              {...register('noiDung')}
              helperText={errors.noiDung?.message}
            />
          </FormField>

          <SelectWithAdd
            label="Bộ phận"
            data={dataBp}
            value={watch('boPhan')}
            onChange={(val) => setValue('boPhan', val, { shouldValidate: true })}
            onOpen={() => openModal('bp')}
            error={errors.boPhan?.message}
            showAddButton={false}
          />
        </DialogContent>
        <DialogActions>
          {isPhieuDeXuat && (
            <Button variant="outlined" onClick={() => openModal('importXml')}>
              Import XML
            </Button>
          )}
          <Button color="inherit" onClick={handleClose}>
            Huỷ
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Tạo
          </Button>
        </DialogActions>
      </form>
      <ModalManager open={!!open} handleClose={closeModal}>
        {open === 'bp' && <CreateBoPhan handleClose={closeModal} />}
        {open === 'loaiVb' && <CreateBoPhan handleClose={closeModal} />}
      </ModalManager>
    </>
  );
}
