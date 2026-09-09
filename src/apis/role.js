import fetcher from './fetcher';

// ----- LẤY THÔNG TIN VAI TRÒ ----- //
export const getDataRole = async () => {
  try {
    const response = await fetcher.get('/vaitro/getAllRole');
    return response.data;
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

// ----- GÁN PHÂN QUYỀN VÀO VAI TRÒ ----- //
export const vaiTroPhanQuyen = async (payload) => {
  console.log('data:',payload);

  try {
    const response = await fetcher.post('/vaiTro/vaiTroPhanQuyen', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- CẬP NHẬT THÔNG TIN VAI TRÒ ----- //
export const editRole = async (payload) => {
  try {
    const response = await fetcher.post('/vaiTro/editRole', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- LẤY QUYỀN CỦA 1 VAI TRÒ ------//
export const getVaiTroPhanQuyen = async (vaiTroId) => {
  try {
    const response = await fetcher.get(`/vaiTro/getVaiTroPhanQuyen/${vaiTroId}`);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};
