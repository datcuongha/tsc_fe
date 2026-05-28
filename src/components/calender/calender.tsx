import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

type Props = {
  value: {
    fromDate: Date | null;
    toDate: Date | null;
  };
  onChange: (value: { fromDate: Date | null; toDate: Date | null }) => void;
};

export function CalenderCustom({ value, onChange }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box display="flex" gap={1}>
        <DatePicker
          label="Từ ngày"
          format="dd/MM/yyyy"
          value={value.fromDate}
          onChange={(newValue) =>
            onChange({
              fromDate: newValue,
              toDate: newValue && value.toDate && newValue > value.toDate ? null : value.toDate,
            })
          }
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
            },
          }}
        />

        <DatePicker
          label="Đến ngày"
          format="dd/MM/yyyy"
          value={value.toDate}
          minDate={value.fromDate || undefined}
          onChange={(newValue) =>
            onChange({
              ...value,
              toDate: newValue,
            })
          }
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
