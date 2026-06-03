import dayjs from 'dayjs';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export type HistoryProps = {
  id: number;
  userEdit: string;
  module: string;
  action: string;
  description: string;
  createDate: string;
};

type HistoryTableRowProps = {
  row: HistoryProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function HistoryTableRow({ row, selected, onSelectRow }: HistoryTableRowProps) {
  return (
    <TableRow>
      {/* <TableCell padding="checkbox">
        <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
      </TableCell> */}
      <TableCell sx={{ width: 160 }}>{row.userEdit}</TableCell>
      <TableCell sx={{ width: 160 }}>{row.action}</TableCell>
      <TableCell sx={{ whiteSpace: 'pre-line' }}>{row.description}</TableCell>{' '}
      <TableCell>
        {row.createDate && dayjs(row.createDate).format('DD/MM/YYYY HH:mm:ss')}{' '}
      </TableCell>
    </TableRow>
  );
}
