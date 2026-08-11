import { CONFIG } from 'src/config-global';

import { History } from 'src/sections/history/view';

export default function Page() {
  return (
    <>
      <title>{`Lịch sư - ${CONFIG.appName}`}</title>

      <History />
    </>
  );
}
