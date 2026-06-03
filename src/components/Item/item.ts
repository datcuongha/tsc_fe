//Item chọn hình thức hóa đơn
export const itemHinhThucHoaDon = [
  {
    key: 'default',
    label: 'Chọn loại hình',
    disabled: true,
  },
  {
    key: '1',
    label: 'Mua mới',
  },
  {
    key: '2',
    label: 'Sửa chữa',
  },
  {
    key: '3',
    label: 'Mực in',
  },
  {
    key: '4',
    label: 'Photo',
  },
  {
    key: '5',
    label: 'BTĐ',
  },
  {
    key: '5',
    label: 'Fast',
  },
  {
    key: '6',
    label: 'Phần mềm',
  },
  {
    key: '7',
    label: 'Linh kiện',
  },
  {
    key: '8',
    label: 'Tiếp khách',
  },
];

//--------------------------------------------------------------------------
export const headLabel = {
  invoice: [
    { id: 'soHd', label: 'Số HĐ', minWidth: 80 },
    { id: 'kyHieuHd', label: 'Ký Hiệu' },
    { id: 'ngayHd', label: 'Ngày', minWidth: 120 },
    { id: 'tenNcc', label: 'Tên NCC', minWidth: 150 },
    { id: 'noiDung', label: 'Nội Dung' },
    { id: 'tienThue', label: 'Vat' },
    { id: 'tongTien', label: 'Tổng Tiền' },
    { id: 'loaiHinh', label: 'Loại Hình', minWidth: 120 },
    { id: '', label: '' },
  ],
  user: [
    { id: 'userName', label: 'Tên đăng nhập' },
    { id: 'fullName', label: 'Họ & tên' },
    { id: 'phone', label: 'Điện thoại' },
    { id: 'email', label: 'Email' },
    { id: 'status', label: 'Trạng thái' },
    { id: '', label: '' },
  ],
  bi: [
    { id: 'title', label: 'Tên báo cáo' },
    { id: 'link', label: 'Đường dẫn' },
    { id: 'status', label: 'Trạng thái' },
    { id: '', label: '' },
  ],
  role: [
    { id: 'name', label: 'Tên vai trò' },
    { id: 'dienGiai', label: 'Mô tả' },
    { id: 'status', label: 'Trạng thái' },
    { id: '', label: '' },
  ],
  deXuat: [
    { id: 'maPhieu', label: 'Mã phiếu' },
    { id: 'tenNcc', label: 'NCC' },
    { id: 'createDate', label: 'Ngày tạo' },
    { id: 'modifiedDate', label: 'Ngày cập nhật' },
    { id: 'tongSl', label: 'Tổng số lượng' },
    { id: 'tongTT', label: 'Tổng đơn hàng' },
    { id: 'status', label: 'Trạng thái' },
    { id: '', label: '' },
  ],
  datHang: [
    { id: 'Tên nhà cung cấp', label: 'NCC' },
    { id: 'Chi nhánh', label: 'Kho' },
    { id: 'Mã hàng', label: 'Mã hàng' },
    { id: 'Tên hàng', label: 'Tên hàng' },
    { id: 'thuMuaNhap', label: 'Số lượng đặt hàng' },
  ],
  soHoa: [
    { id: '', label: '' },
    { id: 'loaiVb', label: 'Loại văn bản' },
    { id: 'soVb', label: 'Số văn bản' },
    { id: 'ngayVb', label: 'Ngày văn bản' },
    { id: 'noiDung', label: 'Nội dung' },
    { id: 'boPhan', label: 'Bộ phận' },
    { id: 'file', label: 'File scan đã up' },
    { id: '', label: '' },
  ],
  history: [
    { id: 'userEdit', label: 'Người thao tác' },
    { id: 'description', label: 'Nội dung thay đổi' },
    { id: 'createDate', label: 'Thời gian' },
    { id: '', label: '' },
  ],
};
