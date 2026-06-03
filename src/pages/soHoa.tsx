import { CONFIG } from 'src/config-global';

import { SoHoaView } from 'src/sections/soHoa/view';

export default function Page() {
  return (
    <>
      <title>{`Số hoá - ${CONFIG.appName}`}</title>
      
      <SoHoaView />
    </>
  );
}
