import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { showAlert } from "../alert";

import type { exportInvProps } from "./type";

export function handleExportData({ data, fileName, columns }: exportInvProps) {
    if (!data || data.length === 0) {
        showAlert({ message: 'Không có dữ liệu để xuất', type: 'warning' })
        return
    }

    const formattedData = data.map(row => {
        const newRow: Record<string, any> = {};
        columns.forEach(col => {
            if (col.id) { // tránh cột trống
                newRow[col.label] = row[col.id];
            }
        })
        return newRow
    })

    // Chuyển đổi thành sheet Excel
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);

    // Xuất file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    const today = new Date().toISOString().slice(0, 10);
    saveAs(fileData, `${fileName} ${today}.xlsx`);
}