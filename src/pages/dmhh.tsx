import { CONFIG } from 'src/config-global';

import { Dmhh } from 'src/sections/trungTam/tongHopDM/dmhh/view';

export default function Page() {
  return (
    <>
      <title>{`Danh mục hàng hoá - ${CONFIG.appName}`}</title>
      
      <Dmhh />
    </>
  );
}
