import { CONFIG } from 'src/config-global';

import { DuyetPhieuView } from 'src/sections/trungTam/donDatHang/duyetPhieu';

export default function Page() {
  return (
    <>
      <title>{`Đề xuất đặt hàng - ${CONFIG.appName}`}</title>
      
      <DuyetPhieuView />
    </>
  );
}
