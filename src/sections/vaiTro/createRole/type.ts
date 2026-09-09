export type CreateRoleProps = {
  handleClose: () => void;
};

export type CreateRoleFrom = {
  name: string;
  dienGiai?: string;
};

export type Permission = {
  id: number;
  code: string;
  module: string;
};

export type CreateRowPayload = {
  id: string;
  name: string;
  dienGiai: string;
  status: boolean;
  permissions: Permission[];
};
