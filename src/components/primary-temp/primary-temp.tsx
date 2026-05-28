import {
  Box,
  Card,
  Table,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { Scrollbar } from '../scrollbar';

export const PageHeader = ({ title, action }: any) => (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ flexGrow: 1 }}>
        {title}
      </Typography>
      {action}
    </Box>
);

type Props = {
  toolbar: React.ReactNode;
  head: React.ReactNode;
  children: React.ReactNode;
  pagination: {
    page: number;
    count: number;
    rowsPerPage: number;
    onPageChange: any;
    onRowsPerPageChange: any;
  };
};

export function PrimaryTemp({ toolbar, head, children, pagination }: Props) {
  return (
      <Card>
        {toolbar}
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              {head}
              <TableBody>{children}</TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={pagination?.page || 0}
          count={pagination?.count || 0}
          rowsPerPage={pagination?.rowsPerPage || 10}
          onPageChange={pagination?.onPageChange}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={pagination?.onRowsPerPageChange}
        />
      </Card>
  );
}
