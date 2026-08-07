export type EditDatHangTMDetail = {
  id: number;
  maPhieuId: number;
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
  detailPhieuDatHang: {
    id: number;
    maHang: string;
    tenSp: string;
    canhBao?: string;
  }[];
};

export type EditDatHangTMData = {
  id: number;
  detailPhieuDeXuat: EditDatHangTMDetail[];
  detailPhieuDatHang: EditDatHangTMDetail[];
  maPhieu: string;
};

export type EditDatHangTMProps = {
  handleClose: () => void;
  data: EditDatHangTMData;
};
