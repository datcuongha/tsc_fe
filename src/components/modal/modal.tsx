import { useState } from 'react';

import { Dialog } from '@mui/material';

import type { ModalTypeProps } from './type';

export function ModalManager({
  open,
  handleClose,
  children,
  maxWidth = 'sm', // 👈 thêm default để không bị lỗi nếu không truyền
}: ModalTypeProps & { maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth
      disableEnforceFocus
      disableAutoFocus
      disableRestoreFocus
    >
      {children}
    </Dialog>
  );
}

// ----- OPEN MODAL ----- //

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
