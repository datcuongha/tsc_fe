import type { Dispatch, SetStateAction } from 'react';

import type { PivotData } from '../view/type';

export type Props = {
  pivot: any[];
  pivotXnt: any[];
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
