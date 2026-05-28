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
