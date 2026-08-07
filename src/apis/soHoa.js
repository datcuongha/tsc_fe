import fetcher from './fetcher';

// ----- LẤY TẤT CẢ DỮ LIỆU ----- //
export const getAllSoHoa = async () => {
  try {
    const response = await fetcher('/so-hoa/getAllSoHoa');
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- TẠO TÀI LIỆU SỐ HOÁ ----- //
export const createSoHoa = async (payload) => {
  try {
    const response = await fetcher.post('/so-hoa/createSoHoa', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- CẬP NHẬT TÀI LIỆU SỐ HOÁ ----- //
export const editSoHoa = async (payload) => {
  try {
    const response = await fetcher.post('/so-hoa/editSoHoa', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};
