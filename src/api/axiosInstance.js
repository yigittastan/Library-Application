import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api-docs", // API'nizin ana adresi
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // isteğin zaman aşım süresi (opsiyonel)
});

export default axiosInstance;
