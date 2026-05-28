import fetcher from "./fetcher";

// ----- LẤY THÔNG TIN HÓA ĐƠN ----- //
export const getInvoiceXlm = async () => {
  try {
    const response = await fetcher.get("/invoice-it/getDataXml");
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- IMPORT XML ----- //
export const importXML = async (payload) => {
  try {
    const response = await fetcher.post("/invoice-it/importXml", payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- TẠO HÓA ĐƠN ----- //
export const createInv = async (payload) => {
  console.log(payload);

  try {
    const response = await fetcher.post("/invoice-it/createInv", payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- EDIT HÓA ĐƠN ----- //
export const editInv = async (payload) => {
  try {
    const response = await fetcher.post("/invoice-it/editInv", payload);
    return response.data.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// ----- XÓA HÓA ĐƠN ----- //
export const delInv = async (id) => {
  
  try {
    const response = await fetcher.delete('/invoice-it/removeInv',{
      params:{
        id
      }
    })
    return response.data.content
  } catch (error) {
    throw error.response.data?.message
  }
}
  // ----- UP FILE SCAN ----- //
export const upFile = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);  // phải trùng với FileInterceptor('file')

    const response = await fetcher.post(
      `/invoice-it/uploadScan?id=${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Upload lỗi';
  }
};