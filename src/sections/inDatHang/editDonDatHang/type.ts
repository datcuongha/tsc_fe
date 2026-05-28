export type EditDDHDetail = {
  id: string;
  ngayKhoDat: string;
  maHang: string;
  tenSp: string;
  dvt: string;
  donGia: number;
  giamGia?: number;
  soLuong: number;
  ghiChuHangHoa:string;
  canhBao: string;
  tonCuoi: number;
  slKhoDat: number;
  slTonToiUu: number;
  slCoTheDat: string;
  slBanCuoi: number;
  slNhapNccCuoi: number;
};

export type EditDDHData = {
  id: string;
  tenNcc: string;
  congTy: string;
  createDate: string;
  detailPhieuDatHang: EditDDHDetail[];

};

export type EditDDHProps = {
  handleClose: () => void;
  data: EditDDHData;
};