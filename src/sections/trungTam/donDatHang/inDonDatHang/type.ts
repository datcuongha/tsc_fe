export type InDonDatHangDetail = {
  id: string;
  ngayKhoDat: string;
  maHang: string;
  tenSp: string;
  dvt: string;
  donGia: number;
  giamGia?: number;
  soLuongGDDuyet: number;
  ghiChuHangHoa: string;
  canhBao: string;
  tonCuoi: number;
  slKhoDat: number;
  slTonToiUu: number;
  slCoTheDat: string;
  slBanCuoi: number;
  slNhapNccCuoi: number;
  thueSuat: string;
  tienThue: number;
  thanhTien: number;
};

export type InDonDatHangDuyet = {
  id: string;
  capDuyet: number;
  ngayDuyet: string;
};

export type InDonDatHangData = {
  id: string;
  tenNcc: string;
  congTy: string;
  diaChi: string;
  mst: string;
  ghiChuHopDong: string;
  createDate: string;
  maPhieu: string;
  thoiGianGiaoHang: string;
  phieuDatHangDetail: InDonDatHangDetail[];
  phieuDatHangDuyet: InDonDatHangDuyet[];
};

export type InDonDatHangProps = {
  handleClose: () => void;
  data: InDonDatHangData;
};
