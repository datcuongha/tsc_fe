import fetcher from "./fetcher";

//-----------------------------------------
//  LẤY DANH SÁCH NHÀ CUNG CÂP
export const getDataNcc = async () => {
  try {
    const response = await fetcher.get("/ncc/LayDanhSachNCC");
    return response.data?.content;
  } catch (error) {
    throw error.response.data?.content;
  }
};

//   TẠO NHÀ CUNG CẤP
export const createNcc = async (payload) => {
  try {
    const response = await fetcher.post("ncc/TaoNCC", payload);
    return response.data?.content;
  } catch (error) {
    throw error.response.data?.messenge;
  }
};

//   CẬP NHẬT NHÀ CUNG CẤP
export const editNcc = async (payload) => {
  try {
    const response = await fetcher.post("/ncc/EditNCC", payload);
    return response.data?.content;
  } catch (error) {
    throw error.response?.data?.messenge;
  }
};

//   XÓA NHÀ CUNG CẤP
export const removeNcc = async (id) => {
  console.log(id);

  try {
    const response = await fetcher.delete("/ncc/XoaNCC", {
      params: {
        id: id,
      },
    });
    return response.data?.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

//   IMPORT NHÀ CUNG CẤP
export const getImportNcc = async (payload) => {
  try {
    const response = await fetcher.post("/ncc/ImportNcc", payload);
    return response.data?.content;
  } catch (error) {
    throw error.response?.data?.messenge;
  }
};

//-----------------------------------------
//  LẤY DANH MỤC HÀNG HÓA
export const getDataSku = async () => {
  try {
    const response = await fetcher.get("/sku/LayDanhSachSku");
    return response.data?.content;
  } catch (error) {
    throw error.response.data?.content;
  }
};


//-----------------------------------------
//   LẤY DANH MỤC NHÓM NGÀNH HÀNG
export const getDataLv = async () => {
  try {
    const response = await fetcher.get("/nhomlv/LayDanhSachNhomLV");

    const dataTree = response.data?.content || [];
    
    // Chuyển dữ liệu từ dạng cây sang danh sách phẳng ngay tại đây
    let result = [];
    for (let lv1 of dataTree) {
      // Nếu không có con thì vẫn push level 1
      if (!lv1.children || lv1.children.length === 0) {
        result.push({
          id: `${lv1.id}`,
          isActive:lv1.isActive,
          idLevel1: lv1.id,
          name1: lv1.name,
          idLevel2: null,
          name2: null,
          idLevel3: null,
          name3: null,
        });
        continue;
      }
    
      for (let lv2 of lv1.children) {
        // Nếu không có con thì chỉ push đến level 2
        if (!lv2.children || lv2.children.length === 0) {
          result.push({
            id: `${lv1.id}-${lv2.id}`,
            isActive:lv2.isActive,
            idLevel1: lv1.id,
            name1: lv1.name,
            idLevel2: lv2.id,
            name2: lv2.name,
            idLevel3: null,
            name3: null,
          });
          continue;
        }
    
        // Có đủ lv1 -> lv2 -> lv3
        for (let lv3 of lv2.children) {
          const idLv3Formatted = String(lv3.id).padStart(3, '0');
          result.push({
            id: `${lv1.id}-${lv2.id}-${idLv3Formatted}`,
            isActive:lv3.isActive,
            idLevel1: lv1.id,
            name1: lv1.name,
            idLevel2: lv2.id,
            name2: lv2.name,
            idLevel3: idLv3Formatted,
            name3: lv3.name,
          });
        }
      }
    }

    return result;
    
  } catch (error) {
    throw error.response?.data?.content || "Lỗi không xác định";
  }
};

// TẠO NHÓM LEVEL 1

export const createLv1 = async (payload) => {
  try {
    const response = await fetcher.post("/nhomlv/TaoNhomLv1", payload);
    return response.data?.content;
  } catch (error) {
    throw error.response.data?.message;
  }
};

// TẠO NHÓM LEVEL 2
export const createLv2= async (payload)=>{
  try {
    const response = await fetcher.post("/nhomlv/TaoNhomLv2",payload);
    return response.data?.content;
  } catch (error) {
    throw error.response.data?.message
  }
}

// TẠO NHÓM LEVEL 3
export const createLv3= async (payload)=>{
  console.log(payload);
  
  try {
    const response = await fetcher.post("/nhomlv/TaoNhomLv3",payload)
    return response.data?.content
  } catch (error) {
    throw error.response.data?.message
  }
}

//   XÓA NHÓM NGÀNH HÀNG
export const removeLv = async (id) => {
  const idLv3 = id.split("-")[2];
  console.log(idLv3);
  try {
    const response = await fetcher.delete("/nhomlv/XoaNhomLV", {
      params: {
        id: idLv3,
      }
    });
    return response.data.content
  } catch (error) {
    throw error.response?.data?.content;
  }
};

// IMPORT NHÓM NGÀNH HÀNG
export const getImportLv = async (payload)=>{
  try {
    const response = await fetcher.post("/nhomlv/ImportLv",payload)
    return response.data.content
  } catch (error) {
    throw error.response.data?.message
  }
}
