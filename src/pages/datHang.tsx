import { CONFIG } from 'src/config-global';

import { DatHangView } from 'src/sections/trungTam/datHang/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Đặt hàng - ${CONFIG.appName}`}</title>

      <DatHangView />
    </>
  );
}
