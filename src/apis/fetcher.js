import axios from 'axios';

const fetcher = axios.create({
  baseURL: 'http://10.1.49.30:8168/api',
  withCredentials: true,
});

// const fetcher = axios.create({
//   baseURL: 'https://api.benthanhtsc.com/api',
//   withCredentials: true,
// });
// const fetcher = axios.create({
//     baseURL:"http://10.1.48.35:8168/api",
//          withCredentials:true
// })
// const fetcher = axios.create({
//   baseURL: 'http://localhost:8168/api',
//   withCredentials: true,
// });

fetcher.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👉 RESPONSE: bắt lỗi
fetcher.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    const code = error.response?.data?.code;

    if (
      code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/refresh-token') // 🔥 fix
    ) {
      originalRequest._retry = true;

      try {
        const res = await fetcher.post('/auth/refresh-token');

        const newToken = res.data.token;

        localStorage.setItem('accessToken', newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return fetcher(originalRequest);
      } catch {
        window.location.href = '/sign-in';
        localStorage.removeItem('accessToken');
      }
    }

    return Promise.reject(error);
  }
);

export default fetcher;
