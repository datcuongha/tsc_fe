import fetcher from './fetcher';

// ----- LẤY DANH SÁCH LINK PI ----- //
export const getAllDashboardAdmin = async () => {
  try {
    const response = await fetcher.get('/dashboardAdmin/getAllDashboardAdmin');
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- TẠO LINK BI ----- //
export const createDashboardLink = async (payload) => {
  try {
    const response = await fetcher.post('/dashboardAdmin/createDashboardLink', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- EDIT LINK BI ----- //
export const editDashboardLink = async (payload) => {
  
  try {
    const response = await fetcher.post('dashboardAdmin/editDashboardLink', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- XOÁ LINK BI ----- //
export const removeDashboardLink = async (id) => {
  try {
    const response = await fetcher.delete('dashboardAdmin/delDashboardLink', {
      params: {
        id,
      },
    });
    return response.data.content
  } catch (error) {
    throw error.response.data?.message;
  }
};
