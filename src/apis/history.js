import fetcher from './fetcher';

export const getAllHistory = async () => {
  try {
    const response = await fetcher.get('/history/getAllHistory');
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};
