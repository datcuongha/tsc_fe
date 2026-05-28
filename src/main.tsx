import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useMemo, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './app';
import { ErrorBoundary } from './routes/components';
import { getRoutesSection } from './routes/sections';
import { AuthProvider } from './context/authContext';
import { getAllDashboardAdmin } from './apis/dashboardAdmin';

// ----------------------------------------------------------------------

const queryClient = new QueryClient();

function AppRouter() {
  const { data: dataDashboardAdmin = [] } = useQuery({
    queryKey: ['dataDashboardAdmin'],
    queryFn: getAllDashboardAdmin,
  });

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          Component: () => (
            <AuthProvider>
              <App>
                <Outlet />
              </App>
            </AuthProvider>
          ),
          errorElement: <ErrorBoundary />,
          children: getRoutesSection(dataDashboardAdmin),
        },
      ]),
    [dataDashboardAdmin]
  );

  return <RouterProvider router={router} />;
}

// ----------------------------------------------------------------------

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  </StrictMode>
);
