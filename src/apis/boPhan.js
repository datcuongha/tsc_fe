import fetcher from './fetcher';

// ----- LẤY THÔNG TIN BỘ PHẬN ----- //
export const getDataBp = async () => {
  try {
    const response = await fetcher.get('/bophan/getDataBp');
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- TẠO BỘ PHẬN ----- //
export const createBp = async (payload) => {
  try {
    const response = await fetcher.post('/bophan/createBp', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- SỬA THÔNG TIN BỘ PHẬN ----- //
export const editBp = async (payload) => {
  try {
    const response = await fetcher.post('/bophan/editBp', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- TẠM NGƯNG BỘ PHẬN ----- //
export const delBp = async (id) => {
  try {
    const response = await fetcher.delete('/bophan/delBp', {
      params: {
        id,
      },
    });
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- XOÁ BỘ PHẬN (ADMIN) ----- //
export const adminDelBp = async (id) => {
  try {
    const response = await fetcher.delete('/bophan/adminDelBp', {
      params: {
        id,
      },
    });
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};
