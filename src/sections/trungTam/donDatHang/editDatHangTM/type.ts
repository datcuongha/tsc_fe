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
  slTonToiUu:number;
};

export type EditDatHangTMData = {
  id: number;
  tenNcc: string;
  phieuDeXuatDetail: EditDatHangTMDetail[];
  phieuDatHangDetail: EditDatHangTMDetail[];
  xntDetail: xntDetailProps[];
  maPhieu: string;
  trangThai: string;
  slCoTheDat: number;
};

export type EditDatHangTMProps = {
  handleClose: () => void;
  data: EditDatHangTMData;
};
// export type EditDatHangTMDetail = {
//   id: string;
//   ngayKhoDat: string;
//   maHang: string;
//   tenSp: string;
//   dvt: string;
//   donGia: number;
//   giamGia?: number;
//   soLuong: number;
//   ghiChuHangHoa: string;
//   canhBao: string;
//   tonCuoi: number;
//   slKhoDat: number;
//   slTonToiUu: number;
//   slCoTheDat: string;
//   slBanCuoi: number;
//   slNhapNccCuoi: number;
//   kySoLieu: string;
// };

// export type EditPhieuDeXuatDetail = {
//   id: number;
//   maHang: string;
//   chiNhanh: string;
//   tenNhaCungCap: string;
//   tenHang: string;
//   giaVon:number;
//   giaBan:number;
//   thuMuaNhap: number | '';
//   nhapChuyen:number
//   xuatBan:number;
//   pgdDuyet:number | '';
//   ghiChuKho:string;
//   tonCuoi:number;
//   slKhoDat:number;
//   canhBao:string;
//   chuThich:string;
//   phieuDatHangNhap:string;
// };

// export type xntDetailProps = {
//   id: number | null;
//   phieuId: number;
//   maHang: string;
//   chiNhanh: string;
//   nhapChuyen: number;
//   xuatBan: number;
//   tonCuoi: number;
//   tenNhaCungCap: string;
// };

// export type EditDatHangTMData = {
//   id: string;
//   tenNcc: string;
//   congTy: string;
//   createDate: string;
//   maDatHangNhap: string;
//   fromDate: string;
//   toDate: string;
//   maPhieu: string;
//   detailPhieuDatHang: EditDatHangTMDetail[];
//   phieuDeXuatDetail: EditPhieuDeXuatDetail[];
//   xntDetail: xntDetailProps[];
//   trangThai:string;
// };

// export type EditDatHangTMProps = {
//   handleClose: () => void;
//   data: EditDatHangTMData;
// };
