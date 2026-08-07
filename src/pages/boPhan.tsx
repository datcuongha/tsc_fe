import { CONFIG } from 'src/config-global';

import { BoPhanView } from 'src/sections/boPhan/view';

export default function Page() {
  return (
    <>
      <title>{`Bộ phận - ${CONFIG.appName}`}</title>

      <BoPhanView />
    </>
  );
}
