// import 'src/global.css';

// import { useEffect } from 'react';
// import { enqueueSnackbar } from 'notistack';
// import { useQueryClient } from '@tanstack/react-query';

// import { usePathname } from 'src/routes/hooks';

// import { ThemeProvider } from 'src/theme/theme-provider';

// import { socket } from './utils/socket';
// // ----------------------------------------------------------------------

// type AppProps = {
//   children: React.ReactNode;
// };

// export default function App({ children }: AppProps) {
//   const queryClient = useQueryClient();
//   useScrollToTop();

//   useEffect(() => {
//     const handleNotify = async (data: any) => {
//       console.log('Socket notify:', data);
//       switch (data.type) {
//         case 'REJECT':
//           enqueueSnackbar(`Phiếu ${data.maPhieu} bị trả lại: ${data.lyDoTraLai}`, {
//             variant: 'error',
//           });

//           queryClient.invalidateQueries({
//             queryKey: ['dataDH'],
//           });
//           break;

//         case 'NEW_APPROVAL':
//           enqueueSnackbar(`Có phiếu ${data.maPhieu} cần duyệt`, { variant: 'success' });

//           queryClient.invalidateQueries({
//             queryKey: ['dataDH'],
//           });
//           break;

//         default:
//           break;
//       }
//     };

//     socket.on('notify', handleNotify);

//     return () => {
//       socket.off('notify', handleNotify);
//     };
//   }, [queryClient]);

//   // const githubButton = () => (
//   //   <Fab
//   //     size="medium"
//   //     aria-label="Github"
//   //     href="https://github.com/minimal-ui-kit/material-kit-react"
//   //     sx={{
//   //       zIndex: 9,
//   //       right: 20,
//   //       bottom: 20,
//   //       width: 48,
//   //       height: 48,
//   //       position: 'fixed',
//   //       bgcolor: 'grey.800',
//   //     }}
//   //   >
//   //     <Iconify width={24} icon="socials:github" sx={{ '--color': 'white' }} />
//   //   </Fab>
//   // );

//   return (
//     <ThemeProvider>
//       {children}
//       {/* {githubButton()} */}
//     </ThemeProvider>
//   );
// }

// // ----------------------------------------------------------------------

// function useScrollToTop() {
//   const pathname = usePathname();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// }
import 'src/global.css';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { usePathname } from 'src/routes/hooks';

import { ThemeProvider } from 'src/theme/theme-provider';

import { socket } from './utils/socket';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  const queryClient = useQueryClient();

  useScrollToTop();

  useEffect(() => {
    const handleNotify = async (data: any) => {
      console.log('Socket notify:', data);

      switch (data.type) {
        case 'REJECT':
        case 'NEW_APPROVAL':
        case 'APPROVED':
          await queryClient.invalidateQueries({
            queryKey: ['dataDH'],
          });
          break;

        default:
          break;
      }
    };

    socket.on('notify', handleNotify);

    return () => {
      socket.off('notify', handleNotify);
    };
  }, [queryClient]);

  return <ThemeProvider>{children}</ThemeProvider>;
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}
