import { useForm } from 'react-hook-form';

import { DialogContent } from '@mui/material';

import type { CreatePhanQuyenProps } from './type';

export function CreatePhanQuyen({ handleClose }: CreatePhanQuyenProps) {
  useForm();

  return (
    <form action="">
      <DialogContent>Tạo phân quyền</DialogContent>
    </form>
  );
}
