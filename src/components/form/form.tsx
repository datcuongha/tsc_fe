import { useEffect, useRef, useState } from 'react';

import Grid from '@mui/material/GridLegacy';
import {
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  ListSubheader,
} from '@mui/material';

import type { UploadFormProps, SelectWithAddProps } from './type';

// ----- FIELD THƯỜNG ----- //
export const FormField = ({ label, children }: any) => (
  <Grid container spacing={2} justifyContent="flex-start" alignItems="center" sx={{ mb: 1 }}>
    <Grid item xs={4}>
      <InputLabel>{label}</InputLabel>
    </Grid>

    <Grid item xs={8}>
      {children}
    </Grid>
  </Grid>
);

// ----- FIELD SELECT ----- //
export const SelectWithAdd = ({
  label,
  data,
  value,
  error,
  onChange,
  onOpen,
}: SelectWithAddProps) => {
  const [search, setSearch] = useState('');

  const filtered = data.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
      <Grid item xs={4}>
        <InputLabel>
          {label} <span style={{ color: 'red' }}>*</span>
        </InputLabel>
      </Grid>

      <Grid item xs={8}>
        <FormControl variant="standard" fullWidth error={!!error}>
          <Grid container spacing={1}>
            <Grid item xs={10}>
              <Select
                fullWidth
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                MenuProps={{
                  autoFocus: false,
                  disableAutoFocusItem: true,
                }}
              >
                <ListSubheader>
                  <TextField
                    size="small"
                    placeholder={`Tìm ${label.toLowerCase()}...`}
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                </ListSubheader>

                {filtered.map((i) => (
                  <MenuItem key={i.id} value={i.id}>
                    {i.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={2}>
              <Button variant="contained" size="small" onClick={onOpen}>
                +
              </Button>
            </Grid>
          </Grid>
        </FormControl>
      </Grid>
      {/* ERROR OUTSIDE */}
      {error && (
        <Grid item xs={12}>
          <Typography variant="caption" color="error" sx={{ ml: '33%' }}>
            {error}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

// ----- FORM UPLOAD FILE ----- //
export const FileUploadField = ({ label, value, onChange }: UploadFormProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!value && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [value]);
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    onChange?.(selectedFile);
  };

  const handleClear = () => {
    onChange?.(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Grid container spacing={3} alignItems="center" sx={{ mb: 5 }} justifyContent="center">
      <Grid item xs={3}>
        <InputLabel>{label}</InputLabel>
      </Grid>

      <Grid item xs={5}>
        <TextField
          fullWidth
          value={value?.name || ''}
          placeholder="Chọn file..."
          InputProps={{
            readOnly: true,
            endAdornment: (
              <>
                {value && (
                  <Button color="error" onClick={handleClear} sx={{ mr: 1 }}>
                    Xoá
                  </Button>
                )}

                <Button component="label" variant="contained">
                  Upload
                  <input
                    ref={inputRef}
                    hidden
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleUpload}
                  />
                </Button>
              </>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
};
