export type EditUserInfoProps = {
  handleClose: () => void;
  data: EditUserPayload | null;
};

export type EditUserInfoForm = {
  email: string;
  brithday?: string | null;
  phone?: string;
  fullName: string;
  address?: string|null;
};

export type EditUserPayload = EditUserInfoForm & { userId: number };
