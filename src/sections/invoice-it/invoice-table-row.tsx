import { useState, useCallback } from "react";

import { Popover, Checkbox, MenuItem, MenuList, TableRow, TableCell, IconButton, menuItemClasses } from "@mui/material";

import { Iconify } from "src/components/iconify";

export type InvoiceProps = {
    id: number,
    soHd: string,
    kyHieuHd: string,
    ngayHd: string,
    loaiHinh: string,
    tenNcc: string,
    noiDung: string,
    tienThue: number,
    tongTien: number,
    ptThanhToan: string,
    mst: string,
    diaChi: string,
    soDt: number,
    email: string,
    nganHang: string,
    webSite: string,
    soTienBangChu: string,
    tyGia: number,
    file?: string|null,
    invoiceItDetails?: {
        id: number;
        danhSachHang: string;
        dvt: string;
        sl: number;
        donGia: number;
        loaiThue: number;
        status: boolean;
    }[];
    // dữ liệu sau map vào form
    item?: {
        danhSachHang: string;
        sl: string;
        donGia: string;
        dvt: string;
    }[]
    stk: string,
    caNhan: string,
    hinhThuc: string,
    status: boolean,
}

type InvoiceTableRowProps = {
    row: InvoiceProps,
    selected: boolean,
    onSelectRow: () => void,
    onEditRow: () => void,
    onViewRow: () => void,
}

export function InvoiceTableRow({ row, selected, onSelectRow, onEditRow, onViewRow }: InvoiceTableRowProps) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
                </TableCell>

                <TableCell>
                    {row.soHd}
                </TableCell>

                <TableCell >
                    {row.kyHieuHd}
                </TableCell>

                <TableCell>
                    {row.ngayHd}
                </TableCell>

                <TableCell>
                    {row.tenNcc}
                </TableCell>

                <TableCell sx={{ whiteSpace: 'wrap' }}>
                    {row.noiDung}
                </TableCell>

                <TableCell>
                    {row.tienThue.toLocaleString('vi-VN')}
                </TableCell>

                <TableCell>
                    {row.tongTien.toLocaleString('vi-VN')}
                </TableCell>

                <TableCell>
                    {row.loaiHinh}
                </TableCell>

                <TableCell align="right">
                    <IconButton onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuList
                    disablePadding
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        width: 140,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                            [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
                        },
                    }}
                >
                    <MenuItem onClick={() => {
                        handleClosePopover();
                        onEditRow()
                    }}>
                        <Iconify icon="solar:pen-bold" />
                        Edit
                    </MenuItem>

                    <MenuItem onClick={handleClosePopover}>
                        <Iconify icon="solar:print-bold" />
                        Print
                    </MenuItem>

                    {/* <MenuItem onClick={handleClosePopover}>
                        <Iconify icon="eva:trending-up-fill" />
                        Up File
                    </MenuItem> */}

                    <MenuItem onClick={() => {
                        handleClosePopover();
                        onViewRow()
                    }}>
                        <Iconify icon="solar:eye-bold" />
                        View
                    </MenuItem>
                </MenuList>
            </Popover>
        </>
    )
}