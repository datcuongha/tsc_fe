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
};

export type EditDatHangTMData = {
  id: number;
  phieuDeXuatDetail: EditDatHangTMDetail[];
  phieuDatHangDetail: EditDatHangTMDetail[];
  xntDetail: xntDetailProps[];
  maPhieu: string;
  trangThai: string;
};

export type EditDatHangTMProps = {
  handleClose: () => void;
  data: EditDatHangTMData;
};
