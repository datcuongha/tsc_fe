import { CONFIG } from 'src/config-global';

import { RoleView } from 'src/sections/vaiTro/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Role - ${CONFIG.appName}`}</title>

      <RoleView />
    </>
  );
}
