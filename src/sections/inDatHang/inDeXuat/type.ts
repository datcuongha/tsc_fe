export type InDeXuatDetail = {
  id: string;
  ngayKhoDat: string;
  maHang: string;
  tenSp: string;
  dvt: string;
  donGia: number;
  giamGia?: number;
  soLuong: number;
  ghiChuHangHoa: string;
  canhBao: string;
  tonCuoi: number;
  slKhoDat: number;
  slTonToiUu: number;
  slCoTheDat: string;
  slBanCuoi: number;
  slNhapNccCuoi: number;
  kySoLieu:string;
};

export type InDeXuatData = {
  id: string;
  tenNcc: string;
  congTy: string;
  createDate: string;
  detailPhieuDatHang: InDeXuatDetail[];
};

export type InDeXuatProps = {
  handleClose: () => void;
  data: InDeXuatData;
};
