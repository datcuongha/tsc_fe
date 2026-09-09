// import { SvgColor } from 'src/components/svg-color';

// // ----------------------------------------------------------------------

// const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

// export type NavItem = {
//   title: string;
//   path: string;
//   icon?: React.ReactNode;
//   info?: React.ReactNode;
//   roles?: number[];
//   children?: NavItem[];
// };

// export const getNavData = (reportMenus: any[]): NavItem[] => [
//   {
//     title: 'Trang chủ',
//     path: '/',
//     icon: icon('ic-benthanh'),
//   },

//   {
//     title: 'Báo cáo',
//     path: '#',
//     icon: icon('ic-baocao'),
//     roles: [1, 2, 3, 5, 7, 8,9],
//     children: [
//       {
//         title: 'Bến Thành Đông',
//         path: '#',
//         children: [
//           {
//             title: 'Bán lẻ',
//             path: '#',
//             children: reportMenus
//               .filter((r: any) => r.status)
//               .map((item: any) => ({
//                 title: item.title,
//                 path: `/${item.location}`,
//               })),
//           },
//           { title: 'Dịch vụ', path: '#' },
//           { title: 'Tổng hợp', path: '#' },
//         ],
//       },
//       {
//         title: 'Công ty',
//         path: '#',
//         // children: [
//         //   {
//         //     title: 'Bán lẻ',
//         //     path: '#',
//         //     children: reportMenus
//         //       .filter((r: any) => r.status)
//         //       .map((item: any) => ({
//         //         title: item.title,
//         //         path: `/${item.location}`,
//         //       })),
//         //   },
//         //   { title: 'Dịch vụ', path: '#' },
//         //   { title: 'Tổng hợp', path: '#' },
//         // ],
//       },
//       {
//         title: 'Hợp nhất',
//         path: '#',
//         // children: [
//         //   {
//         //     title: 'Bán lẻ',
//         //     path: '#',
//         //     children: reportMenus
//         //       .filter((r: any) => r.status)
//         //       .map((item: any) => ({
//         //         title: item.title,
//         //         path: `/${item.location}`,
//         //       })),
//         //   },
//         //   { title: 'Dịch vụ', path: '#' },
//         //   { title: 'Tổng hợp', path: '#' },
//         // ],
//       },
//     ],
//   },

//   {
//     title: 'Trung tâm',
//     path: '#',
//     icon: icon('ic-admin'),
//     roles: [1, 2, 3, 6, 4, 7, 8,9],
//     children: [
//       { title: 'Đặt hàng', path: '/dat-hang' },
//       { title: 'In đặt hàng', path: '/in-dat-hang' },
//       { title: 'Danh mục hàng hoá', path: '/danh-muc-hang-hoa' },
//       { title: 'Danh mục NCC', path: '/danh-muc-ncc' },
//     ],
//   },

//   {
//     title: 'Công ty',
//     path: '#',
//     icon: icon('ic-admin'),
//     roles: [2],
//     children: [{ title: 'Số hoá', path: '/so-hoa' }],
//   },

//   {
//     title: 'Hệ thống',
//     path: '#',
//     icon: icon('ic-admin'),
//     roles: [1, 2],
//     children: [
//       { title: 'Invoice IT', path: '/invoice-it' },
//       { title: 'Quản lý báo cáo', path: '/dashboard-admin' },
//       { title: 'Quản lý người dùng', path: '/user' },
//       { title: 'Quản lý vai trò', path: '/role' },
//       { title: 'Quản lý bộ phận', path: '/bo-phan' },
//       { title: 'Quản lý phân quyền', path: '/phan-quyen' },
//       { title: 'Lịch sử', path: '/history' },
//     ],
//   },
// ];

// export const filterNavByRole = (items: NavItem[], userRole: number): NavItem[] =>
//   items
//     .filter((item) => {
//       if (!item.roles) return true;

//       return item.roles.includes(userRole);
//     })
//     .map((item) => ({
//       ...item,
//       children: item.children ? filterNavByRole(item.children, userRole) : undefined,
//     }));
import type { ReactNode } from 'react';

import { getUserPermissions } from 'src/routes/authGuard';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon?: ReactNode;
  info?: ReactNode;
  permission?: string;
  children?: NavItem[];
};

// ----------------------------------------------------------------------
// Menu gốc
// ----------------------------------------------------------------------

const createNavData = (reportMenus: any[]): NavItem[] => [
  {
    title: 'Trang chủ',
    path: '/',
    icon: icon('ic-benthanh'),
  },

  {
    title: 'Báo cáo',
    path: '#',
    icon: icon('ic-baocao'),
    permission: 'REPORT_BI_VIEW',

    children: [
      {
        title: 'Bến Thành Đông',
        path: '#',

        children: [
          {
            title: 'Bán lẻ',
            path: '#',

            children: reportMenus
              .filter((item: any) => item.status)
              .map((item: any) => ({
                title: item.title,
                path: `/${item.location}`,

                permission: item.permissionCode ?? 'REPORT_BI_VIEW',
              })),
          },
        ],
      },
                { title: 'Dịch vụ', path: '#' },
                { title: 'Tổng hợp', path: '#' },
    ],
  },

  {
    title: 'Trung tâm',
    path: '#',
    icon: icon('ic-admin'),

    children: [
      {
        title: 'Đặt hàng',
        path: '/dat-hang',
        permission: 'DAT_HANG_PIVOT',
      },

      {
        title: 'In đặt hàng',
        path: '/in-dat-hang',
        permission: 'IN_DAT_HANG_VIEW',
      },

      {
        title: 'Danh mục hàng hoá',
        path: '/danh-muc-hang-hoa',
        permission: 'DMHH_VIEW',
      },

      {
        title: 'Danh mục NCC',
        path: '/danh-muc-ncc',
        permission: 'DMNCC_VIEW',
      },
    ],
  },

  {
    title: 'Công ty',
    path: '#',
    icon: icon('ic-admin'),

    children: [
      {
        title: 'Số hoá',
        path: '/so-hoa',
        permission: 'SO_HOA_VIEW',
      },
    ],
  },

  {
    title: 'Hệ thống',
    path: '#',
    icon: icon('ic-admin'),

    children: [
      {
        title: 'Invoice IT',
        path: '/invoice-it',
        permission: 'INVOICE_IT_VIEW',
      },

      {
        title: 'Quản lý báo cáo',
        path: '/dashboard-admin',
        permission: 'REPORT_VIEW',
      },

      {
        title: 'Quản lý người dùng',
        path: '/user',
        permission: 'USER_VIEW',
      },

      {
        title: 'Quản lý vai trò',
        path: '/role',
        permission: 'ROLE_VIEW',
      },

      {
        title: 'Quản lý bộ phận',
        path: '/bo-phan',
        permission: 'BO_PHAN_VIEW',
      },

      {
        title: 'Quản lý phân quyền',
        path: '/phan-quyen',
        permission: 'PHAN_QUYEN_VIEW',
      },

      {
        title: 'Lịch sử',
        path: '/history',
        permission: 'HISTORY_VIEW',
      },
    ],
  },
];

// ----------------------------------------------------------------------
// Lọc menu theo quyền lấy từ token
// ----------------------------------------------------------------------

export const filterNavByPermission = (items: NavItem[], permissions: string[]): NavItem[] =>
  items.reduce<NavItem[]>((result, item) => {
    const allowed = !item.permission || permissions.includes(item.permission);

    if (!allowed) {
      return result;
    }

    const children = item.children ? filterNavByPermission(item.children, permissions) : undefined;

    // Nếu menu cha không còn menu con thì ẩn luôn
    if (item.children && (!children || children.length === 0)) {
      return result;
    }

    result.push({
      ...item,
      children,
    });

    return result;
  }, []);

// ----------------------------------------------------------------------
// Data menu đã lọc
// ----------------------------------------------------------------------

export const getNavData = (reportMenus: any[]): NavItem[] => {
  const permissions = getUserPermissions();

  const items = createNavData(reportMenus);

  return filterNavByPermission(items, permissions);
};
