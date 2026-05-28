export type EditUserForm = {
  fullName: string;
  userName: string;
  email: string;
  phone?: string;
  brithday?: string;
  address?: string;
  status?: boolean;
  vaiTro: string;
  boPhan: string;
};

export type EditUserPayload = {
  userId: number;
  fullName: string;
  userName: string;
  email: string;
  phone?: string;
  brithday?: string;
  address?: string;
  status: number;
  vaiTro: string;
  boPhan: string;
};

export type EditUserProps = {
  handleClose: () => void;
  rowSelect: {
    userId: number;
    fullName: string;
    userName: string;
    email: string;
    phone?: string;
    brithday?: string | null;
    address?: string;
    status?: boolean;
    vaiTroId?: number;
    boPhanId?: number;
  };
};

export type FilterDataBp = {
  id: number;
  status: boolean;
  name: string;
};

export type OptionType = {
  id: number;
  name: string;
};