import { CONFIG } from 'src/config-global';

import { DonDatHangView } from 'src/sections/trungTam/donDatHang/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`In đặt hàng - ${CONFIG.appName}`}</title>

      <DonDatHangView />
    </>
  );
}
