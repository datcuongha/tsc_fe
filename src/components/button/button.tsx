import { Grid, Button } from '@mui/material';

import type { ButtonGroupProps } from './types';

export function ButtonGroup({
  handleOpen,
  handleEdit,
  handleExport,
  handleImport,
  handleChangePass,
}: ButtonGroupProps) {
  return (
    <Grid>
      {handleOpen && (
        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mr: 0.5 }}>
          Thêm
        </Button>
      )}
      {handleEdit && (
        <Button variant="contained" color="inherit" onClick={handleEdit} sx={{ mr: 0.5 }}>
          Chỉnh sửa
        </Button>
      )}
      {handleImport && (
        <Button variant="contained" color="primary" onClick={handleImport} sx={{ mr: 0.5 }}>
          Import
        </Button>
      )}
      {handleExport && (
        <Button variant="contained" color="primary" onClick={handleExport} sx={{ mr: 0.5 }}>
          Export
        </Button>
      )}
      {handleChangePass && (
        <Button variant="contained" color="warning" onClick={handleChangePass} sx={{ mr: 0.5 }}>
          Đổi mật khẩu
        </Button>
      )}
    </Grid>
  );
}

import { useState } from 'react';

export const useModal = <T = any,>() => {
  const [open, setOpen] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const openModal = (name: string, payload?: T) => {
    setOpen(name);
    setData(payload || null);
  };

  const closeModal = () => {
    setOpen(null);
    setData(null);
  };

  return { open, data, openModal, closeModal };
};
