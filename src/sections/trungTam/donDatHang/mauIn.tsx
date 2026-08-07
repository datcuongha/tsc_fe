import { Stack, Button, DialogTitle, DialogActions, DialogContent } from '@mui/material';

type Props = {
  handleClose: () => void;
  printDX: () => void;
  printDDH: () => void;
  trangThai: string;
};

export function ChonLoaiIn({ handleClose, printDX, printDDH, trangThai }: Props) {
  return (
    <>
      <DialogTitle>Chọn mẫu in</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<span>📄</span>}
            onClick={() => {
              handleClose();
              printDX();
            }}
          >
            In phiếu đề xuất
          </Button>

          <Button
            fullWidth
            variant="contained"
            startIcon={<span>🖨️</span>}
            disabled={trangThai !== 'DA_DUYET'}
            onClick={() => {
              handleClose();
              printDDH();
            }}
          >
            In đơn đặt hàng
          </Button>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
      </DialogActions>
    </>
  );
}
