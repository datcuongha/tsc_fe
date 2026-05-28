import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { DashboardContent } from 'src/layouts/dashboard';
import { getAllDashboardAdmin } from 'src/apis/dashboardAdmin';

export function ReportView() {
  const location = useLocation();

  const { data = [] } = useQuery({
    queryKey: ['dashboardAdmin'],
    queryFn: getAllDashboardAdmin,
    enabled: !!location.pathname,
  });

  const currentReport = data.find((item: any) => `/${item.location}` === location.pathname);

  return (
    <DashboardContent
      maxWidth="xl"
      sx={{ height: 'calc(94vh)', width: '100%', overflow: 'hidden', p: 1 }}
    >
      <iframe
        title={currentReport?.title}
        height="100%"
        width="100%"
        src={currentReport?.link}
        frameBorder={0}
        style={{ border: 0, display: 'block' }}
        allowFullScreen
      />
    </DashboardContent>
  );
}
