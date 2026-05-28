import { CONFIG } from 'src/config-global';

import { DatHangView } from 'src/sections/datHang/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Tổng hợp đặt hàng - ${CONFIG.appName}`}</title>

      <DatHangView />
    </>
  );
}
