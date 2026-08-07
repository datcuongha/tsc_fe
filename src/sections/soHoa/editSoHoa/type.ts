export type EditSoHoaProps = {
  handleClose: () => void;
  rowSelect: {
    id: number;
    loaiVb: string;
    dmLoaiVbId: number;
    dmLoaiVb: {
      name: string;
    };
    soVb: string;
    ngayVb: string;
    noiDung: string;
    ngayKy: string;
    boPhan?: {
      id: number;
      name: string;
      status: boolean;
      createDate: string;
      modifiedDate: string | null;
    };
    file: string;
  };
};
