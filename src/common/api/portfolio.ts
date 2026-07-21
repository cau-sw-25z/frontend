import axiosInstance from "./axiosInstance";

export interface PortfolioSummary {
  portfolioId: number;
  name: string;
  stockCount: number;
  totalValuation: number;
  createdAt?: string;
}

export interface PortfolioListResponse {
  count: number;
  portfolios: PortfolioSummary[];
}

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

export interface PortfolioDetail {
  portfolioId: number;
  name: string;
  stockCount: number;
  totalValuation: number;
  items: PortfolioItem[];
}

export interface PortfolioItemRequest {
  ticker: string;
  avgPrice: number;
  quantity: number;
}

export interface PortfolioRequest {
  name: string;
  items: PortfolioItemRequest[];
}
export const getPortfolios = async (): Promise<PortfolioSummary[]> => {
  const response = await axiosInstance.get<unknown, PortfolioListResponse>(
    "/api/portfolio",
  );

  return response.portfolios;
};

export const getPortfolioById = async (
  portfolioId: number,
): Promise<PortfolioDetail> => {
  return axiosInstance.get<unknown, PortfolioDetail>(
    `/api/portfolio/${portfolioId}`,
  );
};

export const createPortfolio = async (
  request: PortfolioRequest,
): Promise<PortfolioDetail> => {
  return axiosInstance.post<unknown, PortfolioDetail, PortfolioRequest>(
    "/api/portfolio",
    request,
  );
};

export const updatePortfolio = async (
  portfolioId: number,
  request: PortfolioRequest,
): Promise<PortfolioDetail> => {
  return axiosInstance.put<unknown, PortfolioDetail, PortfolioRequest>(
    `/api/portfolio/${portfolioId}`,
    request,
  );
};

export const deletePortfolio = async (portfolioId: number): Promise<void> => {
  await axiosInstance.delete<unknown, void>(`/api/portfolio/${portfolioId}`);
};
