import { io } from 'socket.io-client';

export const socket = io('http://10.1.52.16:8168', {
  autoConnect: false, // chỉ kết nối khi login
});
// export const socket = io('http://10.1.52.16:8168', {
//   autoConnect: false, // chỉ kết nối khi login
// });