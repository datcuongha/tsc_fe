import type { RouteObject } from 'react-router-dom';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { AuthGuard } from './authGuard';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const ReportViev = lazy(() => import('src/pages/report-view'));
export const InvoiceItPage = lazy(() => import('src/pages/invoice-it'));
export const UserPage = lazy(() => import('src/pages/user'));
export const RolePage = lazy(() => import('src/pages/role'));
export const DashboardAdmin = lazy(() => import('src/pages/dashboard-admin'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const Profile = lazy(() => import('src/pages/profile'));
export const DatHangPage = lazy(() => import('src/pages/datHang'));
export const InDatHangPage = lazy(() => import('src/pages/inDatHang'));
export const SoHoaPage = lazy(() => import('src/pages/soHoa'));
export const HistoryPage = lazy(() => import('src/pages/histoty'));
const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const getRoutesSection = (reportMenus: any[]): RouteObject[] => [
  {
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={renderFallback()}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <DashboardPage /> },

      {
        element: (
          <AuthGuard roles={[1, 2, 3, 5]}>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          ...reportMenus
            .filter((r: any) => r.status)
            .map((item: any) => ({
              path: item.location,
              element: <ReportViev />,
            })),
          {
            path: ':report',
            element: <ReportViev />,
          },
        ],
      },

      {
        element: (
          <AuthGuard roles={[1, 2, 3, 6]}>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          { path: 'dat-hang', element: <DatHangPage /> },
          { path: 'in-dat-hang', element: <InDatHangPage /> },
        ],
      },

      {
        element: (
          <AuthGuard roles={[2]}>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          { path: 'so-hoa', element: <SoHoaPage /> },
          // { path: 'in-dat-hang', element: <InDatHangPage /> },
        ],
      },

      // admin only
      {
        element: (
          <AuthGuard roles={[1, 2]}>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          { path: 'invoice-it', element: <InvoiceItPage /> },
          { path: 'user', element: <UserPage /> },
          { path: 'role', element: <RolePage /> },
          { path: 'dashboard-admin', element: <DashboardAdmin /> },
          { path: 'history', element: <HistoryPage /> },
          { path: 'dat-hang', element: <DatHangPage /> },
          { path: 'in-dat-hang', element: <InDatHangPage /> },
        ],
      },

      // ai login cũng xem được
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },

  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },

  { path: '*', element: <Page404 /> },
];
