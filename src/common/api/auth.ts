import axiosInstance from "./axiosInstance";

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
  userId: number;
  email: string;
  nickname: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: {
    userId: number;
    email: string;
    nickname: string;
  };
}

// 회원가입 API
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  return axiosInstance.post("/api/auth/signup", data);
};

// 로그인 API
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  return axiosInstance.post("/api/auth/login", data);
};
