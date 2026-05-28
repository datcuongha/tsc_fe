import fetcher from './fetcher';

export const login = async (payload) => {
  try {
    const response = await fetcher.post('/auth/login', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};
