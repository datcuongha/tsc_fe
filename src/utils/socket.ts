import { io } from 'socket.io-client';

// export const socket = io('http://localhost:8168', {
//   autoConnect: false, // chỉ kết nối khi login
// });
export const socket = io('https://api.benthanhtsc.com', {
  autoConnect: false, // chỉ kết nối sau khi đăng nhập
});