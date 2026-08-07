import type { SoHoaProps } from '../soHoa-table-row';

export type FilterDataBp = {
  id: number;
  status: boolean;
  name: string;
};

export type CreataSoHoaPayload = {
  parentId?: string;
  loaiVb: string;
  soVb?: string;
  ngayVb: string;
  noiDung: string;
  ngayKy?: string;
  boPhan?: string;
};

export type CreateSoHoaProps = {
  handleClose: () => void;
  data: SoHoaProps[];
};
