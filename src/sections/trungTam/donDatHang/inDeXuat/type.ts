export type InDeXuatDetail = {
  id: string;
  ngayKhoDat: string;
  maHang: string;
  tenSp: string;
  dvt: string;
  donGia: number;
  giamGia?: number;
  soLuong: number;
  soLuongPGDDuyet: number;
  soLuongGDDuyet: number;
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
export type PhieuDatHangDuyet = {
  id: number;
  phieuId: number;
  userId: number;
  capDuyet: number;
  trangThai: string;
  ngayDuyet: string | null;
  createDate: string;
  ghiChu: string | null;
  users: {
    userId: number;
    fullName: string;
  };
};

export type PhieuDeXuatDetail = {
  id: number;
  phieuDatHangNhap: string;
  ngayKhoDat:string;
};
export type InDeXuatData = {
  id: string;
  tenNcc: string;
  congTy: string;
  createDate: string;
  trangThai: string;
  phieuDatHangNhap: string;
  fromDate: string;
  toDate: string;
  tenNguoiGui: string;
  ngayGui: string;
  maPhieu: string;
  lyDoTraLai: string;
  phieuDatHangDetail: InDeXuatDetail[];
  phieuDeXuatDetail: PhieuDeXuatDetail[];
  phieuDatHangDuyet: PhieuDatHangDuyet[];
};

export type InDeXuatProps = {
  handleClose: () => void;
  data: InDeXuatData;
  userButton: {
    data: {
      userId: number;
      vaiTroId: number;
    };
  };
};
