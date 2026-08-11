import { CONFIG } from 'src/config-global';

import { PhanQuyenView } from 'src/sections/phanQuyen/view';

export default function Page() {
  return (
    <>
      <title>{`Phân quyền - ${CONFIG.appName}`}</title>
      <PhanQuyenView />
    </>
  );
}
