import { Backdrop, CircularProgress } from '@mui/material';

import type { LoadingBackDrop } from './type';

export function LoadingBackdrop({ open, message }: LoadingBackDrop) {
  return (
    <Backdrop
      open={open}
      onClick={(e) => e.preventDefault()}
      sx={(theme) => ({
        color: '#fff',
        zIndex: theme.zIndex.modal + 999,
        flexDirection: 'column',
        gap: 2,
      })}
    >
      <CircularProgress color="inherit" />
      <div>{message}</div>
    </Backdrop>
  );
}
