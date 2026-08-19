import fetcher from './fetcher';

// ----- UPLOAD FILE ĐẶT HÀNG KHO VÀ XNT CHI TIẾT ----- //
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

// ----- XỬ LÝ TỔNG HỢP ĐẶT HÀNG ----- //
export const processTotal = async (payload) => {
  try {
    const response = await fetcher.post('/python/processTotal', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

// ----- LẤY TẤT CẢ ĐƠN ĐẶT HÀNG ----- //
export const getAllDatHang = async () => {
  try {
    const response = await fetcher.get('/dat-hang/getAllDatHang');
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- CÂP NHẬT ĐƠN ĐẶT HÀNG ----- //
export const editDatHangTM = async (payload) => {
  try {
    const response = await fetcher.post('/dat-hang/editDatHangTM', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- CẬP NHẬT GHI CHÚ IN ĐỀ XUÂT ----- //
export const editDonDeXuat = async (payload) => {
  try {
    const response = await fetcher.post('/dat-hang/editDonDeXuat', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.mesaage;
  }
};

// ----- PGD CẬP NHẬP SỐ LƯỢNG ĐƠN ĐỀ XUẤT ----- //
export const editSLPGD = async (payload) => {
  try {
    const response = await fetcher.post('/dat-hang/editSLPGD', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.mesaage;
  }
};

// ----- CẬP NHẬT THỜI GIAN GIAO HÀNG IN ĐẶT HÀNG ----- //
export const updateThoiHanGiaoHang = async (id, thoiGianGiaoHang) => {
  try {
    const response = await fetcher.patch(`/dat-hang/${id}/thoiGianGiaoHang`, {
      thoiGianGiaoHang,
    });
    return response.data.content;
  } catch (error) {
    throw error.response.data?.mesaage;
  }
};

// ----- GỬI DUYỆT ----- //
export const guiDuyet = async (id) => {
  try {
    const response = await fetcher.post('/dat-hang/xuLyPheDuyet', {
      id,
      action: 'GUI',
    });
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- DUYỆT PHIẾU CẤP 1 ----- //
export const getPhieuById = async (id) => {
  try {
    const response = await fetcher.get(`/dat-hang/getPhieuById?id=${id}`);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy thông tin phiếu');
  }
};

// ----- DUYỆT PHIẾU ----- //
export const duyetPhieu = async (id) => {
  try {
    const response = await fetcher.post('/dat-hang/xuLyPheDuyet', {
      id,
      action: 'DUYET',
    });
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- TỪ CHỐI PHIẾU ----- //
export const tuChoiPhieu = async (payload) => {
  try {
    const response = await fetcher.post('/dat-hang/xuLyPheDuyet', payload);
    return response.data.content;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const getHangByMa = async (id) => {
  try {
    const response = await fetcher.get('', {
      id,
    });
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};
