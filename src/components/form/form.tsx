// import { useEffect, useRef, useState } from 'react';

import { useRef, useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
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
    <Grid size={4}>
      <InputLabel>{label}</InputLabel>
    </Grid>

    <Grid size={8}>{children}</Grid>
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
  showAddButton = true,
  required = true,
}: SelectWithAddProps) => {
  const [search, setSearch] = useState('');

  const filtered = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  // Chỉ gán value khi lựa chọn đó tồn tại trong data.
  // Việc này tránh lỗi out-of-range trong lúc API chưa tải xong.
  const selectedValue = data.some((item) => String(item.id) === String(value)) ? String(value) : '';

  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
      <Grid size={4}>
        <InputLabel>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </InputLabel>
      </Grid>

      <Grid size={8}>
        <FormControl variant="standard" fullWidth error={!!error}>
          <Grid container spacing={1}>
            <Grid size={showAddButton ? 10 : 12}>
              <Select
                fullWidth
                value={selectedValue}
                onChange={(event) => onChange(String(event.target.value))}
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
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => event.stopPropagation()}
                    onClick={(event) => event.stopPropagation()}
                    autoFocus
                  />
                </ListSubheader>

                {filtered.map((item) => (
                  <MenuItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {showAddButton && (
              <Grid size={2}>
                <Button variant="contained" size="small" onClick={onOpen}>
                  +
                </Button>
              </Grid>
            )}
          </Grid>
        </FormControl>
      </Grid>

      {error && (
        <Grid size={12}>
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
      <Grid size={3}>
        <InputLabel>{label}</InputLabel>
      </Grid>

      <Grid size={5}>
        <TextField
          fullWidth
          value={value?.name || ''}
          placeholder="Chọn file..."
          slotProps={{
            input: {
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
            },
          }}
        />
      </Grid>
    </Grid>
  );
};
