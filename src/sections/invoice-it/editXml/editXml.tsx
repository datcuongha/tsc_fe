import type { SubmitHandler} from 'react-hook-form';

import { useState } from 'react';
import { array, object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Grid from '@mui/material/GridLegacy';
import { Add, Delete } from '@mui/icons-material';
import { Paper, Table, Button, Select, MenuItem, TableRow, TableBody, TableCell, TableHead, TextField, IconButton, InputLabel, DialogTitle, FormControl, DialogActions, DialogContent, TableContainer } from '@mui/material'

import { editInv } from 'src/apis/it';

import { showAlert, capitalizeFirstLetter } from 'src/components/alert';

import { widthImport } from '../utils';

import type { EditXmlProps, EditInvoiceForm } from './type'


const editSchema = object({
    loaiHinh: string(),
    soHd: string()
        .required('Không để trống số hóa đơn'),
    kyHieuHd: string()
        .required('Không để trống ký hiệu hóa đơn'),
    ngayHd: string()
        .required('Không để trống ngày hóa đơn'),
    tenNcc: string()
        .required('Không để trống tên nhà cung cấp'),
    diaChi: string()
        .required('Không để trống địa chỉ'),
    noiDung: string()
        .required('Không để trống nội dung thanh toán'),
    item: array().of(
        object({
            danhSachHang: string()
                .required('Không để trống tên hàng hóa'),
            donGia: string()
                .required('Không để trống đơn giá')
                .matches(/^\d+$/, 'Phải là số'),
            sl: string()
                .required('Không để trống số lượng')
                .matches(/^\d+$/, 'Phải là số'),
            dvt: string()
                .required('Không để trống đơn vị tính'),
            loaiThue: string()
                .required('Không để trống VAT')
        })
    ),
    hinhThuc: string(),
    stk: string().when("hinhThuc", {
        is: "ck",
        then: schema => schema.required("Không để trống số tài khoản"),
        otherwise: schema => schema.notRequired(),
    }),
    caNhan: string().when("hinhThuc", {
        is: "ck",
        then: schema => schema.required('Không để trống tên tài khoản'),
        otherwise: schema => schema.notRequired(),
    }),
    nganHang: string().when('hinhThuc', {
        is: 'ck',
        then: schema => schema.required('Không để trống tên ngân hàng'),
        otherwise: schema => schema.notRequired(),
    }),
    tyGia: string()
        .matches(/^\d+$/, { message: "Phải là số", excludeEmptyString: true }),


})

export function EditXml({ handleClose, dataLH, rowSelect }: EditXmlProps) {
    const queryClient = useQueryClient()
    const [selectLoaiHinh, setSelectLoaiHinh] = useState(rowSelect?.loaiHinh)

    const { register, handleSubmit, formState: { errors }, watch, control } = useForm({
        defaultValues: {
            soHd: rowSelect?.soHd,
            kyHieuHd: rowSelect?.kyHieuHd,
            ngayHd: rowSelect?.ngayHd,
            tenNcc: rowSelect?.tenNcc,
            diaChi: rowSelect?.diaChi,
            noiDung: rowSelect?.noiDung,
            tyGia: rowSelect?.tyGia ? String(rowSelect?.tyGia) : '',
            hinhThuc: rowSelect?.ptThanhToan,
            caNhan: rowSelect?.caNhan,
            stk: rowSelect?.stk,
            nganHang: rowSelect?.nganHang,
            item: rowSelect?.invoiceItDetails
                ?.filter((detail) => detail.status === true)
                .map((item) => ({
                    id: item.id,
                    danhSachHang: item.danhSachHang || '',
                    sl: item.sl ? String(item.sl) : '',
                    donGia: item.donGia ? String(item.donGia) : '',
                    loaiThue: item.loaiThue ? String(item.loaiThue) : '',
                    dvt: item.dvt || ''
                })) || [],

        },
        resolver: yupResolver(editSchema),
        mode: 'onTouched'
    })

    const hinhThuc = watch('hinhThuc')

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'item',
    });

    const { mutate } = useMutation({
        mutationFn: (values: EditInvoiceForm) => {
            const formatValues = {
                ...values,
                kyHieuHd: values.kyHieuHd.toUpperCase(),
                tenNcc: values.tenNcc.toUpperCase(),
                diaChi: capitalizeFirstLetter(values.diaChi),
                loaiHinh: selectLoaiHinh
            }
            return editInv(formatValues)
        },
        onError: (error) => {
            showAlert(error)
        },
        onSuccess: () => {
            showAlert({ type: 'success', message: 'Đã cập nhật thành công' })
            handleClose()
            queryClient.invalidateQueries({
                queryKey: ['dataXml']
            })
        }
    })

    const handleForSubmit: SubmitHandler<EditInvoiceForm> = (data) => {
        mutate(data)
    }

    return (
        <form onSubmit={handleSubmit(handleForSubmit)}>
            <DialogTitle>Edit Invoice </DialogTitle>
            <DialogContent>
                <Grid
                    container
                    spacing={2}
                    justifyContent='flex-start'
                    alignItems='center'
                >
                    {/* bảng trái */}
                    <Grid item xs={8}>
                        <TableContainer component={Paper}>
                            <Table size='small'>
                                <TableHead sx={{ background: '#f5f5f5' }}>
                                    <TableRow>
                                        <TableCell>Tên hàng</TableCell>
                                        <TableCell>ĐVT</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                        <TableCell>VAT</TableCell>
                                        <TableCell>Đơn giá</TableCell>
                                        <TableCell align='center'>#</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <TextField
                                                    variant="standard"
                                                    defaultValue={field.danhSachHang}
                                                    {...register(`item.${index}.danhSachHang` as const)}
                                                    error={!!errors.item?.[index]?.danhSachHang}
                                                    helperText={errors.item?.[index]?.danhSachHang?.message}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    variant="standard"
                                                    defaultValue={field.dvt}
                                                    {...register(`item.${index}.dvt` as const)}
                                                    error={!!errors.item?.[index]?.dvt}
                                                    helperText={errors.item?.[index]?.dvt?.message}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <TextField
                                                    variant="standard"
                                                    defaultValue={field.sl}
                                                    {...register(`item.${index}.sl` as const)}
                                                    error={!!errors.item?.[index]?.sl}
                                                    helperText={errors.item?.[index]?.sl?.message}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <TextField
                                                    variant="standard"
                                                    defaultValue={field.loaiThue}
                                                    {...register(`item.${index}.loaiThue` as const)}
                                                    error={!!errors.item?.[index]?.loaiThue}
                                                    helperText={errors.item?.[index]?.loaiThue?.message}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <TextField
                                                    variant="standard"
                                                    defaultValue={field.donGia}
                                                    {...register(`item.${index}.donGia` as const)}
                                                    error={!!errors.item?.[index]?.donGia}
                                                    helperText={errors.item?.[index]?.donGia?.message}
                                                />
                                            </TableCell>

                                            <TableCell align="center">
                                                <IconButton color="error" onClick={() => remove(index)}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Button
                            startIcon={<Add />}
                            variant="outlined"
                            sx={{ mt: 1 }}
                            onClick={() => append({
                                danhSachHang: "",
                                sl: "",
                                donGia: "",
                                loaiThue: "",
                                dvt: "",
                            })}
                        >
                            Thêm dòng
                        </Button>
                    </Grid>

                    {/* bảng phải  */}
                    <Grid item xs={4}>
                        <Grid
                            container
                            spacing={2}
                            justifyContent='flex-start'
                            alignItems='center'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>Loại hình:</InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                                <FormControl
                                    sx={{ ...widthImport }}
                                    variant='standard'
                                >
                                    <Select
                                        value={selectLoaiHinh}
                                        onChange={(e) => setSelectLoaiHinh(e.target.value)}
                                    >
                                        {dataLH.map((item) => (
                                            <MenuItem
                                                key={item.key}
                                                value={item.label}
                                                disabled={item.label === 'Chọn loại hình'}
                                            >
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <Grid
                            container
                            spacing={2}
                            justifyContent='flex-start'
                            alignItems='center'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>Số hóa đơn:</InputLabel>
                            </Grid>

                            <Grid item xs={8}>
                                <TextField
                                    variant='standard'
                                    sx={{ ...widthImport }}
                                    error={!!errors.soHd}
                                    {...register('soHd')}
                                    helperText={errors.soHd?.message}
                                />

                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            justifyContent='flex-start'
                            alignItems='center'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>Ký hiệu hóa đơn:</InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    variant='standard'
                                    sx={{ ...widthImport }}
                                    error={!!errors.kyHieuHd}
                                    {...register('kyHieuHd')}
                                    helperText={errors.kyHieuHd?.message}
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            justifyContent='flex-start'
                            alignItems='center'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>Ngày hóa đơn:</InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    variant='standard'
                                    sx={{ ...widthImport }}
                                    error={!!errors.ngayHd}
                                    {...register('ngayHd')}
                                    helperText={errors.ngayHd?.message}
                                />

                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            justifyContent='flex-start'
                            alignItems='center'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>Tên nhà cung cấp:</InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    variant='standard'
                                    sx={{ ...widthImport }}
                                    error={!!errors.tenNcc}
                                    {...register('tenNcc')}
                                    helperText={errors.tenNcc?.message}
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            justifyContent='flex-start'
                            alignItems='center'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>Địa chỉ:</InputLabel>
                            </Grid>

                            <Grid item xs={8}>
                                <TextField
                                    variant='standard'
                                    sx={{ ...widthImport }}
                                    error={!!errors.diaChi}
                                    {...register('diaChi')}
                                    helperText={errors.diaChi?.message}
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            justifyContent='flex-start'
                            alignItems='center'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>Nội dung: </InputLabel>
                            </Grid>

                            <Grid item xs={8}>
                                <TextField
                                    variant='standard'
                                    sx={{ ...widthImport }}
                                    error={!!errors.noiDung}
                                    {...register('noiDung')}
                                    helperText={errors.noiDung?.message}
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            justifyContent='flex-start'
                            alignItems='center'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>Tỷ giá:</InputLabel>
                            </Grid>

                            <Grid item xs={8}>
                                <TextField
                                    variant='standard'
                                    sx={{ ...widthImport }}
                                    error={!!errors.tyGia}
                                    {...register('tyGia')}
                                    helperText={errors.tyGia?.message}
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            spacing={2}
                            justifyContent='flex-start'
                            alignItems='center'
                            mb={1}
                        >
                            <Grid item xs={4}>
                                <InputLabel>Hình thức TT:</InputLabel>
                            </Grid>

                            <Grid item xs={8}>
                                <FormControl variant='standard'>
                                    <Select
                                        sx={{ ...widthImport }}
                                        value={hinhThuc}
                                        {...register('hinhThuc')}
                                    >
                                        <MenuItem value='tm'>
                                            Tiền mặt
                                        </MenuItem>

                                        <MenuItem value='ck'>
                                            Chuyển khoản
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {hinhThuc === 'ck' && (
                            <>
                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent='flex-start'
                                    alignItems='center'
                                    mb={1}
                                >
                                    <Grid item xs={4}>
                                        <InputLabel> Tên tài khoản:</InputLabel>
                                    </Grid>

                                    <Grid item xs={8}>
                                        <TextField
                                            variant='standard'
                                            sx={{ ...widthImport }}
                                            error={!!errors.caNhan}
                                            {...register('caNhan')}
                                            helperText={errors.caNhan?.message}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent='flex-start'
                                    alignItems='center'
                                    mb={1}
                                >
                                    <Grid item xs={4}>
                                        <InputLabel>Số tài khoản:</InputLabel>
                                    </Grid>

                                    <Grid item xs={8}>
                                        <TextField
                                            variant='standard'
                                            sx={{ ...widthImport }}
                                            error={!!errors.stk}
                                            {...register('stk')}
                                            helperText={errors.stk?.message}
                                        />

                                    </Grid>
                                </Grid>

                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent='flex-start'
                                    alignItems='center'
                                    mb={1}
                                >
                                    <Grid item xs={4}>
                                        <InputLabel>Ngân hàng:</InputLabel>
                                    </Grid>

                                    <Grid item xs={8}>
                                        <TextField
                                            variant='standard'
                                            sx={{ ...widthImport }}
                                            error={!!errors.nganHang}
                                            {...register('nganHang')}
                                            helperText={errors.nganHang?.message}
                                        />

                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button color='inherit' onClick={handleClose}>
                    Hủy
                </Button>
                <Button type='submit' color='warning' >
                    Xác nhận
                </Button>
            </DialogActions>
        </form >
    )
}
