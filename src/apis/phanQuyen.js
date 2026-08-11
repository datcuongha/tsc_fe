import fetcher from './fetcher';

// ----- LẤY DANH SÁCH PHÂN QUYỀN ----- //
export const getAllPq = async () => {
  try {
    const response = await fetcher.get('/phanquyen/getAllPq');
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};
