import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/api";
import { tokenStorage } from "@/utils/tokenStorage";
import.meta.env = Vite;
// ========================================
// Axios 인스턴스 생성
// 모든 API 요청에 공통으로 적용될 설정
// ========================================
const axiosInstance = axios.create({
  // 기본 URL: Vite proxy가 /api로 시작하는 요청을 BE 서버로 전달
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // 요청 타임아웃: 10초
  timeout: 10000,

  // 기본 헤더: JSON 형식으로 통신
  headers: {
    "Content-Type": "application/json",
  },
});

// ========================================
// 요청 인터셉터
// 모든 API 요청 전에 실행됨
// ========================================
axiosInstance.interceptors.request.use((config) => {
  // tokenStorage에서 JWT 토큰 가져오기
  const token = tokenStorage.getAccessToken();

  // 토큰이 있으면 Authorization 헤더에 자동 추가
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ========================================
// 응답 인터셉터
// 모든 API 응답이 이 함수를 통과해서 컴포넌트에 전달됨
// ========================================
axiosInstance.interceptors.response.use(
  // 성공 응답 처리 (HTTP status 2xx)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (response: AxiosResponse<ApiResponse<any>>): any => {
    const apiResponse = response.data;

    // BE 명세상 success: false인 경우
    // (HTTP는 200이지만 비즈니스 로직 실패)
    if (!apiResponse.success) {
      return Promise.reject(new Error(apiResponse.message));
    }

    // success: true면 data 필드만 추출해서 반환
    return apiResponse.data;
  },

  // 에러 응답 처리 (HTTP status 4xx, 5xx)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: AxiosError<ApiResponse<any>>) => {
    // 서버에서 응답이 온 경우
    if (error.response) {
      const status = error.response.status;
      const apiResponse = error.response.data;

      // 401: 인증 만료 처리
      if (status === 401) {
        tokenStorage.removeAccessToken();
        console.error("인증이 필요합니다.");

        // TODO:
        // refresh token 재발급 로직은 BE 명세 확정 후 구현
      }

      // 서버 에러 메시지 추출
      const message = apiResponse?.message || "알 수 없는 오류가 발생했습니다.";

      return Promise.reject(new Error(message));
    }

    // 네트워크 오류
    if (error.request) {
      return Promise.reject(new Error("서버에 연결할 수 없습니다."));
    }

    // 그 외 오류
    return Promise.reject(error);
  },
);

export default axiosInstance;
