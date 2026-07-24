import axiosInstance from "./axiosInstance";

// 포트폴리오 목록에 표시되는 요약 정보
export interface PortfolioSummary {
  portfolioId: number;
  name: string;
  stockCount: number;
  totalValuation: number;
  createdAt?: string;
}

// 포트폴리오 목록 조회 응답
export interface PortfolioListResponse {
  count: number;
  portfolios: PortfolioSummary[];
}

// 포트폴리오에 포함된 개별 종목
export interface PortfolioItem {
  stockId: number;
  ticker: string;
  name: string;
  market: string;
  avgPrice: number;
  quantity: number;
  currentPrice: number;
  weightPercent: number;
}

// 포트폴리오 상세 정보
export interface PortfolioDetail {
  portfolioId: number;
  name: string;
  stockCount: number;
  totalValuation: number;
  items: PortfolioItem[];
}

// 포트폴리오 생성 시 포함할 종목
export interface PortfolioItemRequest {
  ticker: string;
  avgPrice: number;
  quantity: number;
}

// 포트폴리오 생성 요청
export interface CreatePortfolioRequest {
  name: string;
  items: PortfolioItemRequest[];
}

// 포트폴리오 이름 수정 요청
export interface UpdatePortfolioNameRequest {
  name: string;
}

// 기존 포트폴리오에 종목 하나 추가 요청
export interface AddPortfolioStockRequest {
  ticker: string;
  avgPrice: number;
  quantity: number;
}

// 포트폴리오 목록 조회
export const getPortfolios = async (): Promise<PortfolioSummary[]> => {
  const response = await axiosInstance.get<unknown, PortfolioListResponse>(
    "/api/portfolio",
  );

  return response.portfolios;
};

// 포트폴리오 상세 조회
export const getPortfolioById = async (
  portfolioId: number,
): Promise<PortfolioDetail> => {
  return axiosInstance.get<unknown, PortfolioDetail>(
    `/api/portfolio/${portfolioId}`,
  );
};

// 포트폴리오 생성
export const createPortfolio = async (
  request: CreatePortfolioRequest,
): Promise<PortfolioDetail> => {
  return axiosInstance.post<unknown, PortfolioDetail, CreatePortfolioRequest>(
    "/api/portfolio",
    request,
  );
};

// 포트폴리오 이름 수정
export const updatePortfolioName = async (
  portfolioId: number,
  request: UpdatePortfolioNameRequest,
): Promise<PortfolioDetail> => {
  return axiosInstance.put<
    unknown,
    PortfolioDetail,
    UpdatePortfolioNameRequest
  >(`/api/portfolio/${portfolioId}`, request);
};

// 포트폴리오 삭제
export const deletePortfolio = async (portfolioId: number): Promise<void> => {
  await axiosInstance.delete<unknown, void>(`/api/portfolio/${portfolioId}`);
};

// 포트폴리오에 종목 하나 추가
export const addPortfolioStock = async (
  portfolioId: number,
  request: AddPortfolioStockRequest,
): Promise<PortfolioDetail> => {
  return axiosInstance.post<unknown, PortfolioDetail, AddPortfolioStockRequest>(
    `/api/portfolio/${portfolioId}/stocks`,
    request,
  );
};

// 포트폴리오에서 종목 하나 삭제
export const deletePortfolioStock = async (
  portfolioId: number,
  ticker: string,
): Promise<PortfolioDetail> => {
  return axiosInstance.delete<unknown, PortfolioDetail>(
    `/api/portfolio/${portfolioId}/stocks/${encodeURIComponent(ticker)}`,
  );
};
