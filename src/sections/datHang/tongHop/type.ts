import type { Dispatch, SetStateAction } from 'react';

export type Props = {
  data: any[];
  setData: Dispatch<SetStateAction<any[]>>;
  handleClose: () => void;
  userId: number;
};
