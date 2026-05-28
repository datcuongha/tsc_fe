import type { InvoiceProps } from "../invoice-table-row";

export interface LoaiHinh {
  key: string | number;
  label: string;
  disabled?: boolean;
}
export type EditXmlProps = {
    handleClose: () => void
    dataLH:LoaiHinh[]
    rowSelect: InvoiceProps|null
}

export type EditInvoiceForm = {
  soHd: string;
  kyHieuHd: string;
  ngayHd: string;
  tenNcc: string;
  diaChi: string;
  noiDung: string;
  item?: {
    danhSachHang: string;
    sl: string;
    donGia: string;
    tyGia?: string;
    loaiThue:string;
    dvt: string;
  }[];
  hinhThuc?: string;
  stk?: string;
  caNhan?: string;
  nganHang?: string;
};