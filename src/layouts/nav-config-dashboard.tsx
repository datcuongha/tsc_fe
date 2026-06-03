import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon?: React.ReactNode;
  info?: React.ReactNode;
  roles?: number[];
  children?: NavItem[];
};

export const getNavData = (reportMenus: any[]): NavItem[] => [
  {
    title: 'Trang chủ',
    path: '/',
    icon: icon('ic-benthanh'),
  },

  {
    title: 'Báo cáo',
    path: '#',
    icon: icon('ic-baocao'),
    roles: [1, 2, 3, 5],
    children: [
      {
        title: 'Bến Thành Đông',
        path: '#',
        children: [
          {
            title: 'Bán lẻ',
            path: '#',
            children: reportMenus
              .filter((r: any) => r.status)
              .map((item: any) => ({
                title: item.title,
                path: `/${item.location}`,
              })),
          },
          { title: 'Dịch vụ', path: '#' },
          { title: 'Tổng hợp', path: '#' },
        ],
      },
      {
        title: 'Công ty',
        path: '#',
        // children: [
        //   {
        //     title: 'Bán lẻ',
        //     path: '#',
        //     children: reportMenus
        //       .filter((r: any) => r.status)
        //       .map((item: any) => ({
        //         title: item.title,
        //         path: `/${item.location}`,
        //       })),
        //   },
        //   { title: 'Dịch vụ', path: '#' },
        //   { title: 'Tổng hợp', path: '#' },
        // ],
      },
      {
        title: 'Hợp nhất',
        path: '#',
        // children: [
        //   {
        //     title: 'Bán lẻ',
        //     path: '#',
        //     children: reportMenus
        //       .filter((r: any) => r.status)
        //       .map((item: any) => ({
        //         title: item.title,
        //         path: `/${item.location}`,
        //       })),
        //   },
        //   { title: 'Dịch vụ', path: '#' },
        //   { title: 'Tổng hợp', path: '#' },
        // ],
      },
    ],
  },

  {
    title: 'Trung tâm',
    path: '#',
    icon: icon('ic-admin'),
    roles: [1, 2, 3, 6],
    children: [
      { title: 'Đặt hàng', path: '/dat-hang' },
      { title: 'In đặt hàng', path: '/in-dat-hang' },
    ],
  },

  {
    title: 'Công ty',
    path: '#',
    icon: icon('ic-admin'),
    roles: [2],
    children: [{ title: 'Số hoá', path: '/so-hoa' }],
  },

  {
    title: 'Hệ thống',
    path: '#',
    icon: icon('ic-admin'),
    roles: [1, 2],
    children: [
      { title: 'Quản lý người dùng', path: '/user' },
      { title: 'Quản lý vai trò', path: '/role' },
      { title: 'Quản lý báo cáo', path: '/dashboard-admin' },
      { title: 'Lịch sử', path: '/history' },
      { title: 'Invoice IT', path: '/invoice-it' },
    ],
  },
];

export const filterNavByRole = (items: NavItem[], userRole: number): NavItem[] =>
  items
    .filter((item) => {
      if (!item.roles) return true;

      return item.roles.includes(userRole);
    })
    .map((item) => ({
      ...item,
      children: item.children ? filterNavByRole(item.children, userRole) : undefined,
    }));
