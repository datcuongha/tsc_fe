export type Permission = {
  id: number;
  code: string;
  name: string;
  module: string;
};

export type RoleRow = {
  id: number;
  name: string;
  dienGiai?: string;
};

export type RolePermissionDetail = {
  vaiTro: RoleRow;
  phanQuyen: Permission[];
};

export type EditRoleProps = {
  handleClose: () => void;
  rowSelect: RoleRow;
};

export type EditRoleFrom = {
  name: string;
  dienGiai?: string;
};