export type EditLinkProps = {
  handleClose: () => void;
  rowSelect: EditLinkForm;
};

export type EditLinkForm = {
  id?:string;
  title: string;
  link: string;
  status?: boolean;
};
