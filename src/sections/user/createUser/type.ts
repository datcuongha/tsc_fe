export type CreateUserPros = {
  handleClose: () => void;
};

export type FilterDataBp = {
  id: number;
  status: boolean;
  name: string;
};

export type CreateUserForm = {
  userName: string;
  pass: string;
  confirmPass: string;
  email: string;
  brithday?: string;
  phone?: string | null;
  fullName: string;
  address?: string;
  vaiTro: string;
  boPhan: string;
};

export type CreateUserPayload = Omit<CreateUserForm, 'confirmPass'>;
