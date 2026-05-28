

export interface LoaiHinh {
  key: string | number;
  label: string;
  disabled?: boolean;
}
export type CreateXmlProps = {
  handleClose: () => void,
  dataLH: LoaiHinh[];
}

export type CreateInvoiceForm = {
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
    dvt: string;
  }[];
  hinhThuc?: string;
  stk?: string;
  caNhan?: string;
  nganHang?: string;
};