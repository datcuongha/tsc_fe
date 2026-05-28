import type { Breakpoint } from '@mui/material/styles';

import { merge } from 'es-toolkit';
import { useQuery } from '@tanstack/react-query';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { useAuth } from 'src/context/authContext';
import { getAllDashboardAdmin } from 'src/apis/dashboardAdmin';

import { NavMobile, NavContent } from './nav';
import { layoutClasses } from '../core/classes';
import { _account } from '../nav-config-account';
import { dashboardLayoutVars } from './css-vars';
import { MainSection } from '../core/main-section';
import { getNavData } from '../nav-config-dashboard';
import { MenuButton } from '../components/menu-button';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';
import { AccountPopover } from '../components/account-popover';

import type { NavItem } from '../nav-config-dashboard';
import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type DashboardLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
  };
};

export function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg',
}: DashboardLayoutProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const { data: dataDashboardAdmin = [] } = useQuery<any[]>({
    queryKey: ['dataDashboardAdmin'],
    queryFn: getAllDashboardAdmin,
  });

  const navData = getNavData(dataDashboardAdmin);
  const filteredNav = navData.filter((item: NavItem) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.data.vaiTroId);
  });
  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: false,
      },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      leftArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: 1 }}>
          {/* Mobile menu button */}
          <MenuButton
            onClick={onOpen}
            sx={{ color: 'white', [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
          />

          {/* Mobile drawer */}
          <NavMobile data={navData} open={open} onClose={onClose} />

          {/* Desktop menu ngang */}
          <Box
            sx={{
              display: 'none',
              [theme.breakpoints.up(layoutQuery)]: {
                display: 'flex',
                alignItems: 'center',
              },
              alignItems: 'center',
              height: 1,
            }}
          >
            <NavContent data={filteredNav} />
          </Box>
        </Box>
      ),

      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountPopover data={_account} />
        </Box>
      ),
    };
    return (
      <HeaderSection
        disableElevation
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        sx={{
          height: 45,
          position: 'relative',
          backgroundColor: '#0B74DE',

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            zIndex: -1,
          },
        }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        // sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Sidebar
       *************************************** */
      // sidebarSection={
      //   <NavDesktop data={navData} layoutQuery={layoutQuery}  />
      // }
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ ...dashboardLayoutVars(theme), ...cssVars }}
      sx={[
        {
          [`& .${layoutClasses.sidebarContainer}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              // pl: 'var(--layout-nav-vertical-width)', sidebar nằm dọc
              transition: theme.transitions.create(['padding-left'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
            },
          },
          // ✅ nếu bạn dùng MUI Container (DashboardContent) gây thụt
          '& .MuiContainer-root': {
            paddingLeft: 2,
            paddingRight: 1,
            maxWidth: '100%',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}
