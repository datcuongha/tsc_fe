export type Option = {
  id: string | number;
  name: string;
};

export type SelectWithAddProps = {
  label: string;
  data: Option[];
  value: any;
  error?: string;
  placeholder?: string;
  onChange: (value: any) => void;
  onOpen: () => void;
  showAddButton?: boolean;
  required?: boolean;
};

export type UploadFormProps = {
  label: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
};
