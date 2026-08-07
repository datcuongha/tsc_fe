export type EditBpProps = {
  handleClose: () => void;
  rowSelect: {
    id: number;
    maBp: string;
    name: string;
    status: boolean;
  };
};

export type EditBpForm = {
  maBp: string;
  name: string;
  status: boolean;
};
