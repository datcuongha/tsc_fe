export type EditRoleProps = {
  handleClose: () => void;
  rowSelect: EditRowPayload;
};

export type EditRoleFrom = {
  name: string;
  dienGiai?: string;
};

export type EditRowPayload = {
  id: string;
  name: string;
  dienGiai: string;
  status: boolean;
};
