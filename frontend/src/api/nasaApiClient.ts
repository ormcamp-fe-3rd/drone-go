import axios from "axios";

// Axios 인스턴스 생성
const nasaApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", // 브라우저처럼 요청
  },
});

// 요청 인터셉터 (토큰 자동 추가)
nasaApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nasa_token"); // NASA API 키가 있다면
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 (에러 처리)
nasaApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access - NASA API 키 확인 필요");
      // NASA API 키 재발급 or 로그인 페이지로 리디렉션 로직 가능
    } else if (error.response?.status === 403) {
      console.error("Forbidden - NASA API 접근 권한 없음");
    } else if (error.response?.status === 307) {
      console.warn(
        "Temporary Redirect - 경로 변경 가능성 있음",
        error.response.headers,
      );
    }
    return Promise.reject(error);
  },
);

export default nasaApiClient;
