export type EditDatHangTMDetail = {
  id:number;
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
  ngayKhoDat:string;
};

export type EditDatHangTMData = {
  id: number;
  detailPhieuDeXuat: EditDatHangTMDetail[];
};

export type EditDatHangTMProps = {
  handleClose: () => void;
  data: EditDatHangTMData;
};
