import fetcher from './fetcher';

export const process = async (file1, file2) => {
  try {
    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    const response = await fetcher.post('/python/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const processTotal = async (data, userId) => {
  try {
    const response = await fetcher.post('/python/processTotal', {
      ...data,
      userId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getAllDatHang = async () => {
  try {
    const response = await fetcher.get('/dat-hang/getAllDatHang');
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

export const editDatHangTM = async (payload) => {
  try {
    const response = await fetcher.post('/dat-hang/editDatHangTM', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

export const editDonDeXuat = async (payload) => {
  try {
    const response = await fetcher.post('/dat-hang/editDonDeXuat', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.mesaage;
  }
};
