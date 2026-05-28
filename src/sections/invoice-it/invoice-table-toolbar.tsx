import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from "@mui/material";

import { Iconify } from "src/components/iconify";

type InvoiceTableToolbarProps = {
    numSelected: number;
    filterName: string;
    onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
    delInv: () => void,
}

export function InvoiceTableToolbar({ numSelected, filterName, onFilterName, delInv }: InvoiceTableToolbarProps) {
    return (
        <Toolbar
            sx={{
                height: 96,
                display: 'flex',
                justifyContent: 'space-between',
                p: (theme) => theme.spacing(0, 1, 0, 3),
                ...(numSelected > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter',
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    component="div"
                    variant="subtitle1"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <OutlinedInput
                    fullWidth
                    value={filterName}
                    onChange={onFilterName}
                    placeholder="Search Loại hình ..."
                    startAdornment={
                        <InputAdornment position="start">
                            <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                    }
                    sx={{ maxWidth: 320 }}
                />
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={delInv} sx={{ color: 'error.main' }}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <Iconify icon="ic:round-filter-list" />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    )
}