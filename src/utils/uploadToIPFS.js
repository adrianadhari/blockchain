// src/utils/uploadToIPFS.js
import axios from "axios";

export const uploadToIPFS = async (file) => {
  // const maxFileSize = 5 * 1024 * 1024; // 5MB
  // if (file.size > maxFileSize) {
  //   throw new Error("File terlalu besar. Maksimum 5MB.");
  // }

  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post("http://103.140.55.141:4000/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // { cid, url }
};
