import { useState } from "react";
import { XMLParser } from "fast-xml-parser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Grid from '@mui/material/GridLegacy';
import { Button, Select, MenuItem, TextField, InputLabel, Typography, DialogTitle, DialogActions, DialogContent } from "@mui/material";

import { importXML } from "src/apis/it";

import { showAlert } from "src/components/alert";
import { itemHinhThucHoaDon } from "src/components/Item/item";

import { widthImport } from "../utils";

import type { ImportXmlProps } from "./type"; 

export function ImportXml({
    handleClose,
}: ImportXmlProps) {
    const queryClient = useQueryClient()
    const itemData = itemHinhThucHoaDon
    const [file, setFile] = useState("")
    const [invoiceData, setInvoiceData] = useState<any>(null);
    const [noiDung, setNoiDung] = useState("");
    const [hinhThuc, setHinhThuc] = useState("tm")
    const [loaiHinh, setLoaiHinh] = useState("Chọn loại hình")


    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]

        if (selectedFile) {
            setFile(selectedFile.name);

            const reader = new FileReader();

            reader.onload = (event) => {
                const xml = event.target?.result;

                const parser = new XMLParser({
                    ignoreAttributes: false,
                    parseTagValue: false, // ✅ giữ nguyên tất cả là string
                });

                const result = parser.parse(xml as string); // Đọc XML sang JSON

                // ✅ Truy xuất dữ liệu cần thiết:
                const dlhDon = result?.HDon?.DLHDon;
                const ttChung = dlhDon?.TTChung;
                const ndHDon = dlhDon?.NDHDon;

                const soHd = ttChung?.SHDon
                const kyHieuHd = ttChung?.KHHDon
                const ngayHd = ttChung?.NLap;
                const tenNcc = ndHDon?.NBan?.Ten;
                const mst = ndHDon?.NBan?.MST;
                const diaChi = ndHDon?.NBan?.DChi;
                const sdt = ndHDon?.NBan?.SDThoai;
                const email = ndHDon?.NBan?.DCTDTu;
                const stk = ndHDon?.NBan?.STKNHang;
                const nganHang = ndHDon?.NBan?.TNHang;
                const webSite = ndHDon?.NBan?.Website;
                const danhSachHang = ndHDon?.DSHHDVu?.HHDVu;
                const tienThue = ndHDon?.TToan?.TgTThue;
                const tongTien = ndHDon?.TToan?.TgTTTBSo;
                const soTienBangChu = ndHDon?.TToan?.TgTTTBChu;

                const invoice = {
                    soHd,
                    kyHieuHd,
                    ngayHd,
                    tenNcc,
                    mst,
                    diaChi,
                    sdt,
                    email,
                    stk,
                    nganHang,
                    webSite,
                    tongTien,
                    tienThue,
                    danhSachHang: Array.isArray(danhSachHang) ? danhSachHang : [danhSachHang],
                    noiDung, // sẽ gán lại từ state khi Upload
                    loaiHinh,
                    ptThanhToan: hinhThuc,
                    soTienBangChu,
                };
                setInvoiceData(invoice); // ✅ lưu vào state
            };
            reader.readAsText(selectedFile);
        }
    }

    const handleImport = () => {
        if (!invoiceData) {
            showAlert({ message: 'Chưa import file XML', type: 'error' })
            return
        }
        mutation.mutate(invoiceData)

    }
    const mutation = useMutation({
        mutationFn: (values) => importXML(values),
        onSuccess: () => {
            showAlert({ message: 'Thành công', type: 'success' });
            handleClose();
            queryClient.invalidateQueries({
                queryKey: ["dataXml"]
            })
        },
        onError: (error) => {
            const errMsg = typeof error === 'string' ? error : 'Có lỗi xảy ra!';
            showAlert({ message: errMsg, type: 'error' });
        }
    });
    return (
        <>
            <DialogTitle>Import Invoice</DialogTitle>

            <DialogContent>

                <Grid container spacing={2} alignItems="center" justifyContent="flex-start" mb={1}>
                    <Grid item xs={5} >
                        <InputLabel >
                            Hình thức hóa đơn:
                        </InputLabel>
                    </Grid>

                    <Grid item xs={5}>
                        <Select
                            sx={{ ...widthImport }}
                            value={loaiHinh}
                            onChange={(e) => setLoaiHinh(e.target?.value)}
                        >
                            {itemData.map((item) =>
                                <MenuItem
                                    key={item.key}
                                    value={item.label}
                                    disabled={item.disabled || false}
                                >
                                    {item.label}
                                </MenuItem>
                            )}
                        </Select>
                    </Grid>
                </Grid>

                <Grid container spacing={2} alignItems="center" justifyContent="flex-start" mb={1}>
                    <Grid item xs={5}>
                        <InputLabel>
                            Nội dung:
                        </InputLabel>
                    </Grid>

                    <Grid item xs={7}>
                        <TextField
                            sx={{ ...widthImport }}
                            value={noiDung}
                            onChange={(e) => setNoiDung(e.target?.value)}
                            disabled={loaiHinh === "Chọn loại hình"}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} alignItems="center" justifyContent="flex-start" mb={1}>
                    <Grid item xs={5}>
                        <InputLabel>
                            Phương thức thanh toán:
                        </InputLabel>
                    </Grid>

                    <Grid item xs={7}>
                        <Select
                            sx={{ ...widthImport }}
                            value={hinhThuc}
                            onChange={(e) => setHinhThuc(e.target?.value)}
                           
                        >
                            <MenuItem
                                value='tm'
                            >
                                Tiền mặt
                            </MenuItem>
                            <MenuItem
                                value='ck'
                            >
                                Chuyển khoản
                            </MenuItem>
                        </Select>
                    </Grid>
                </Grid>

                <Grid container spacing={2} alignItems="center" justifyContent="flex-start" mb={1}>
                    {/* Cột 1 */}
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            disabled={noiDung === ""}
                        >
                            Chọn file XML
                            <input
                                type="file"
                                hidden
                                accept=".xml"
                                onChange={handleInput}
                            />
                        </Button>
                    </Grid>


                    {/* Cột 2 */}
                    <Grid item xs={8}>
                        {file && (
                            <Typography variant="body2" >
                                File: <strong>{file}</strong>
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </DialogContent >

            <DialogActions>
                <Button onClick={handleClose} color="inherit">
                    Hủy
                </Button>
                <Button variant="contained" color="primary" onClick={handleImport}>
                    Import
                </Button>
            </DialogActions>
        </>
    )
}