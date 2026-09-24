import { CONFIG } from 'src/config-global';

import { History } from 'src/sections/history/view';

export default function Page() {
  return (
    <>
      <title>{`Lịch sử - ${CONFIG.appName}`}</title>

      <History />
    </>
  );
}
