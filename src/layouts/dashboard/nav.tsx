import { varAlpha } from 'minimal-shared/utils';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';

import { RouterLink } from 'src/routes/components';

// =====================================================
// 🔥 DESKTOP MENU (RECURSIVE - ENTERPRISE)
// =====================================================
const MenuItemRecursive = ({ item }: any) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<any>(null);
  const [direction, setDirection] = useState<'right' | 'left'>('right');

  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        setDirection('left');
      } else {
        setDirection('right');
      }
    }
  }, [open]);

  return (
    <Box
      ref={ref}
      sx={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* ITEM */}
      <Box
        component={!item.children ? RouterLink : 'div'}
        {...(!item.children && { href: item.path })}
        sx={{
          px: 2,
          py: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          color: 'inherit',
          fontSize: 14,
          '&:hover': {
            bgcolor: 'primary.main',
            borderRadius: 2,
            color: '#fff',
          },
        }}
      >
        {item.title}
        {item.children && <span style={{ marginLeft: 10 }}>▶</span>}
      </Box>

      {/* SUBMENU */}
      {item.children && open && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            [direction === 'right' ? 'left' : 'right']: '100%',
            bgcolor: '#fff',
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            zIndex: 9999,
          }}
        >
          {item.children.map((child: any) => (
            <MenuItemRecursive key={child.title} item={child} />
          ))}
        </Box>
      )}
    </Box>
  );
};

// =====================================================
// 🔥 NAV DESKTOP
// =====================================================
export function NavContent({ data, sx }: any) {
  const [menuItem, setMenuItem] = useState<any>(null);

  return (
    <Box sx={{ display: 'flex', gap: 1, ...sx }}>
      {data.map((item: any) => (
        <Box
          key={item.title}
          sx={{ position: 'relative' }} // 🔥 fix menu lệch
          onMouseEnter={() => setMenuItem(item)}
          onMouseLeave={() => setMenuItem(null)}
        >
          <ListItem disablePadding sx={{ width: 'auto'  }}>
            <ListItemButton
              component={!item.children ? RouterLink : 'div'}
              {...(!item.children && { href: item.path })}
              sx={(theme) => ({
                px: 1.5,
                py: 1.3,
                gap: 1,
                borderRadius: 999,
                minHeight: 30,
                color: theme.vars.palette.common.white,
                '&:hover': {
                  bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.15),
                },
              })}
            >
              {item.icon && <Box sx={{ width: 20, height: 20 }}>{item.icon}</Box>}
              {item.title}
            </ListItemButton>
          </ListItem>

          {/* ROOT MENU */}
          {menuItem?.title === item.title && item.children && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0, // 🔥 FIX KHÔNG LỆCH
                bgcolor: '#fff',
                minWidth: 220,
                borderRadius: 2,
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                zIndex: 9999,
              }}
            >
              {item.children.map((child: any) => (
                <MenuItemRecursive key={child.title} item={child} />
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

// =====================================================
// 🔥 MOBILE MENU (CONTROLLED)
// =====================================================
const MobileItem = ({ item }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Box
        component={!item.children ? RouterLink : 'div'}
        {...(!item.children && { href: item.path })}
        onClick={() => item.children && setOpen(!open)}
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: '1px solid #eee',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        {item.title}
        {item.children && <span>{open ? '▼' : '▶'}</span>}
      </Box>

      {item.children && (
        <Collapse in={open}>
          <Box sx={{ pl: 2 }}>
            {item.children.map((child: any) => (
              <MobileItem key={child.title} item={child} />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

export function NavMobile({ data, open, onClose }: any) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 280 }}>
        <Box sx={{ p: 2, fontWeight: 'bold', borderBottom: '1px solid #eee' }}>Menu</Box>

        {data.map((item: any) => (
          <MobileItem key={item.title} item={item} />
        ))}
      </Box>
    </Drawer>
  );
}
