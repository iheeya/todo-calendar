import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // API 서버의 기본 URL 설정
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
