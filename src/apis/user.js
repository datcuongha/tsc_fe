import fetcher from './fetcher';

// ----- LẤY DANH SÁCH USER ----- //
export const getAllUser = async () => {
  try {
    const response = await fetcher.get('/user/getAllUser');
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- TẠO USER ----- //
export const createUser = async (payload) => {

  try {
    const response = await fetcher.post('/user/createUser', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- EDIT USER ----- //
export const editUser = async (payload) => {
  try {
    const response = await fetcher.post('/user/editUser', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- CHANGE PASS USER ----- //
export const changePass = async (payload) => {
  try {
    const response = await fetcher.post('/user/changePass', payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- REMOVE USER ----- //
export const removeUser = async (id) => {
  try {
    const response = await fetcher.delete('/user/delUser', {
      params: {
        id,
      },
    });
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- LẤY THÔNG TIN 1 USER ----- //
export const getUserInfo = async (id) => {
  try {
    const response = await fetcher.get('/user/getUserInfo', {
      params: {
        id,
      },
    });
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- EDIT THÔNG TIN 1 USER ----- //
export const editUserInfo = async (payload) => {
  try {
    const response = await fetcher.post('/user/editUserInfo',payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};
