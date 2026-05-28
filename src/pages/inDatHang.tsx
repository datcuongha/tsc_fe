import { CONFIG } from 'src/config-global';

import { InDatHangView } from 'src/sections/inDatHang/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`In đặt hàng - ${CONFIG.appName}`}</title>

      <InDatHangView />
    </>
  );
}
