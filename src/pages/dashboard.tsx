import { CONFIG } from 'src/config-global';

import { OverviewAnalyticsView as DashboardView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Dashboard - ${CONFIG.appName}`}</title>
      <meta
        name="Bến Thành TSC"
        content="Website nội bộ"
      />
      <meta name="keywords" content="Power Bi, power bi" />

      <DashboardView />
    </>
  );
}
