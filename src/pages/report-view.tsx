import { CONFIG } from 'src/config-global';

import { ReportView } from 'src/sections/report/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Admin - ${CONFIG.appName}`}</title>

      <ReportView />
    </>
  );
}
