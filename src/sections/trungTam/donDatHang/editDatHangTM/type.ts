export type EditDatHangTMDetail = {
  isNew?: boolean;
  id: number;
  phieuId: number;
  chiNhanh: string;
  maHang: string;
  tenNhaCungCap: string;
  tenHang: string;
  nhapChuyen: number;
  xuatBan: number;
  tonCuoi: number;
  slKhoDat: number;
  giaVon: number;
  giaBan: number;
  canhBao: string;
  ghiChu: string;
  thuMuaNhap: number | '';
  ngayKhoDat: string;
  chuThich: string;
  slCoTheDat: number;
  slTonToiUu: number;
};

export type xntDetailProps = {
  id: number | null;
  phieuId: number;
  maHang: string;
  chiNhanh: string;
  nhapChuyen: number;
  xuatBan: number;
  tonCuoi: number;
  tenNhaCungCap: string;
  slCoTheDat: number;
  canhBao: string;
  slTonToiUu: number;
};

export type EditDatHangTMData = {
  id: number;
  tenNcc: string;
  phieuDeXuatDetail: EditDatHangTMDetail[];
  phieuDatHangDetail: EditDatHangTMDetail[];
  xntDetail: xntDetailProps[];
  maPhieu: string;
  trangThai: string;
  slCoTheDat: number | null;
};

export type EditDatHangTMProps = {
  handleClose: () => void;
  data: EditDatHangTMData;
};
