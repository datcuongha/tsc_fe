import { CONFIG } from 'src/config-global';

import { DuyetDetailView } from 'src/sections/trungTam/donDatHang/duyetDetail';

export default function Page() {
  return (
    <>
      <title>{`Đề xuất đặt hàng - ${CONFIG.appName}`}</title>
      
      <DuyetDetailView />
    </>
  );
}
