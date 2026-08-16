// export type EditDatHangTMDetail = {
//   id: number;
//   maPhieuId: number;
//   chiNhanh: string;
//   maHang: string;
//   tenNhaCungCap: string;
//   tenHang: string;
//   nhapChuyen: number;
//   xuatBan: number;
//   tonCuoi: number;
//   slKhoDat: number;
//   giaVon: number;
//   giaBan: number;
//   canhBao: string;
//   ghiChu: string;
//   thuMuaNhap: number | '';
//   ngayKhoDat: string;
//   detailPhieuDatHang: {
//     id: number;
//     maHang: string;
//     tenSp: string;
//     canhBao?: string;
//   }[];
// };

// export type EditDatHangTMData = {
//   id: number;
//   detailPhieuDeXuat: EditDatHangTMDetail[];
//   detailPhieuDatHang: EditDatHangTMDetail[];
//   maPhieu: string;
// };

// export type EditDatHangTMProps = {
//   handleClose: () => void;
//   data: EditDatHangTMData;
// };

export type EditDatHangTMDetail = {
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
  kySoLieu: string;
};

export type EditPhieuDeXuatDetail = {
  id: string;
  maHang: string;
  chiNhanh: string;
  tenNhaCungCap: string;
  tenSp: string;
  thuMuaNhap:number;
  soLuong:number;
  dvt:string;
  donGia:number;
  ghiChuHangHoa:string;
  tonCuoi:number;
  slKhoDat:number;
  slTonToiUu:number;
  slCoTheDat:number;
  slBanCuoi:number;
  slNhapNccCuoi:number;

};

export type EditDatHangTMData = {
  id: string;
  tenNcc: string;
  congTy: string;
  createDate: string;
  maDatHangNhap: string;
  fromDate: string;
  toDate: string;
  maPhieu: string;
  detailPhieuDatHang: EditDatHangTMDetail[];
  detailPhieuDeXuat: EditPhieuDeXuatDetail[];
};

export type EditDatHangTMProps = {
  handleClose: () => void;
  data: EditDatHangTMData;
};
