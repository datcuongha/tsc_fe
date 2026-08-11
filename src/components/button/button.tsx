import { Grid, Button } from '@mui/material';

import type { ButtonGroupProps } from './types';

export function ButtonGroup({
  handleOpen,
  handleEdit,
  handleExport,
  handleImport,
  handleChangePass,
  handleGetApi,
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
      {handleGetApi && (
        <Button variant="contained" color="info" onClick={handleGetApi} sx={{ mr: 0.5 }}>
          Lấy API
        </Button>
      )}
    </Grid>
  );
}

// ----- ĐỌC FILE XML ----- //
