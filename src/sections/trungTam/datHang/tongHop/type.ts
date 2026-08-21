import type { Dispatch, SetStateAction } from 'react';

import type { PivotData } from '../view/type';

export type PivotXntItem = {
  'Chi nhánh'?: string;
  'Mã hàng'?: string;
  'Nhập NCC'?: number;
  'Nhập chuyển'?: number;
  'Xuất bán'?: number;
  'Tồn cuối kì'?: number;
  'SL tồn kho tối ưu'?: number;
  'Cảnh báo'?: string;

  'SL có thể đặt hàng'?: number | string;
};

export type PivotItem = {
  fromDate?: string;
  toDate?: string;

  isNew?: boolean;

  'Thời gian'?: string;

  'Chi nhánh'?: string;
  'Mã hàng'?: string;
  'Tên hàng'?: string;
  'Tên nhà cung cấp'?: string;

  'Ghi chú hàng hóa'?: string;

  'Giá vốn'?: number;
  'Giá bán'?: number;

  'Số lượng kho đặt'?: number;
  'SL kho đặt'?: number;

  'Nhập NCC'?: number;
  'Nhập chuyển'?: number;
  'Xuất bán'?: number;
  'Tồn cuối kì'?: number;

  'SL tồn kho tối ưu'?: number;

  'Cảnh báo'?: string;

  'SL có thể đặt hàng'?: number | string;

  thuMuaNhap?: number | string;
  slCoTheDat?: number | string;
  chuThich?: string;
};
export type Props = {
  pivot: PivotItem[];
  pivotXnt: PivotXntItem[];
  setData: Dispatch<SetStateAction<PivotData>>;
  handleClose: () => void;
  userId: number;
  hasDuplicate: boolean;
  duplicates: {
    phieuDatHangNhap: string;
    maPhieu: string;
    tenNcc:string;
  }[];
};
