import { CONFIG } from 'src/config-global';

import { Dmncc } from 'src/sections/trungTam/tongHopDM/dnncc/view';

export default function Page() {
  return (
    <>
      <title>{`Danh mục nhà cung cấp - ${CONFIG.appName}`}</title>
      
      <Dmncc />
    </>
  );
}
