import fetcher from './fetcher';

// ----- LẤY THÔNG TIN VAI TRÒ ----- //
export const getDataRole = async () => {
  try {
    const response = await fetcher.get('/vaitro/getAllRole');
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- TẠO VAI TRÒ ----- //
export const creatRole = async (payload) => {
  try {
    const response = await fetcher.post('/vaitro/createRole', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- LẤY TẤT CẢ PHÂN QUYỀN ----- //



