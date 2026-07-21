import { create } from "zustand";
import {
  createPortfolio as createPortfolioApi,
  deletePortfolio as deletePortfolioApi,
  getPortfolioById,
  getPortfolios,
  updatePortfolio as updatePortfolioApi,
  type PortfolioDetail,
  type PortfolioRequest,
  type PortfolioSummary,
} from "../../../common/api/portfolio";

type Stock = {
  ticker: string;
  name: string;
  price: number;
  changeRate: number;
};

interface PortfolioState {
  // 기존 로컬 종목 상태
  totalAsset: number;
  selectedStockIds: string[];
  portfolioStocks: Stock[];

  // 서버 포트폴리오 상태
  portfolios: PortfolioSummary[];
  selectedPortfolio: PortfolioDetail | null;
  isLoading: boolean;
  error: string | null;

  // 기존 로컬 상태 함수
  setTotalAsset: (totalAsset: number) => void;
  addSelectedStockId: (stockId: string) => void;
  removeSelectedStockId: (stockId: string) => void;
  clearSelectedStockIds: () => void;
  addStock: (
    portfolioId: number,
    stock: {
      ticker: string;
      avgPrice: number;
      quantity: number;
    },
  ) => Promise<void>;

  removeStock: (portfolioId: number, ticker: string) => Promise<void>;

  // 서버 API 함수
  fetchPortfolios: () => Promise<void>;
  fetchPortfolioById: (portfolioId: number) => Promise<void>;

  createPortfolio: (data: PortfolioRequest) => Promise<void>;

  updatePortfolio: (
    portfolioId: number,
    data: PortfolioRequest,
  ) => Promise<void>;

  deletePortfolio: (portfolioId: number) => Promise<void>;

  clearSelectedPortfolio: () => void;
  clearError: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  // 기존 로컬 상태
  totalAsset: 0,
  selectedStockIds: [],
  portfolioStocks: [],

  // 서버 상태
  portfolios: [],
  selectedPortfolio: null,
  isLoading: false,
  error: null,

  setTotalAsset: (totalAsset) => {
    set({ totalAsset });
  },

  addSelectedStockId: (stockId) => {
    set((state) => {
      if (state.selectedStockIds.includes(stockId)) {
        return state;
      }

      return {
        selectedStockIds: [...state.selectedStockIds, stockId],
      };
    });
  },

  removeSelectedStockId: (stockId) => {
    set((state) => ({
      selectedStockIds: state.selectedStockIds.filter((id) => id !== stockId),
    }));
  },

  clearSelectedStockIds: () => {
    set({
      selectedStockIds: [],
    });
  },

  addStock: async (portfolioId, stock) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const currentPortfolio = await getPortfolioById(portfolioId);

      const alreadyExists = currentPortfolio.items.some(
        (item) => item.ticker === stock.ticker,
      );

      if (alreadyExists) {
        throw new Error("이미 포트폴리오에 포함된 종목입니다.");
      }

      const updatedPortfolio = await updatePortfolioApi(portfolioId, {
        name: currentPortfolio.name,
        items: [
          ...currentPortfolio.items.map((item) => ({
            ticker: item.ticker,
            avgPrice: item.avgPrice,
            quantity: item.quantity,
          })),
          {
            ticker: stock.ticker,
            avgPrice: stock.avgPrice,
            quantity: stock.quantity,
          },
        ],
      });

      set((state) => ({
        selectedPortfolio: updatedPortfolio,

        portfolios: state.portfolios.map((portfolio) =>
          portfolio.portfolioId === portfolioId
            ? {
                ...portfolio,
                name: updatedPortfolio.name,
                stockCount: updatedPortfolio.stockCount,
                totalValuation: updatedPortfolio.totalValuation,
              }
            : portfolio,
        ),

        isLoading: false,
      }));
    } catch (error) {
      console.error("포트폴리오 종목 추가 실패:", error);

      const message =
        error instanceof Error
          ? error.message
          : "포트폴리오에 종목을 추가하지 못했습니다.";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  removeStock: async (portfolioId, ticker) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const currentPortfolio = await getPortfolioById(portfolioId);

      const remainingItems = currentPortfolio.items.filter(
        (item) => item.ticker !== ticker,
      );

      if (remainingItems.length === currentPortfolio.items.length) {
        throw new Error("포트폴리오에서 해당 종목을 찾을 수 없습니다.");
      }

      if (remainingItems.length === 0) {
        throw new Error("포트폴리오에는 최소 1개 이상의 종목이 있어야 합니다.");
      }

      const updatedPortfolio = await updatePortfolioApi(portfolioId, {
        name: currentPortfolio.name,
        items: remainingItems.map((item) => ({
          ticker: item.ticker,
          avgPrice: item.avgPrice,
          quantity: item.quantity,
        })),
      });

      set((state) => ({
        selectedPortfolio: updatedPortfolio,

        portfolios: state.portfolios.map((portfolio) =>
          portfolio.portfolioId === portfolioId
            ? {
                ...portfolio,
                name: updatedPortfolio.name,
                stockCount: updatedPortfolio.stockCount,
                totalValuation: updatedPortfolio.totalValuation,
              }
            : portfolio,
        ),

        isLoading: false,
      }));
    } catch (error) {
      console.error("포트폴리오 종목 삭제 실패:", error);

      const message =
        error instanceof Error
          ? error.message
          : "포트폴리오에서 종목을 삭제하지 못했습니다.";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  fetchPortfolios: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const portfolios = await getPortfolios();

      set({
        portfolios,
        isLoading: false,
      });
    } catch (error) {
      console.error("포트폴리오 목록 조회 실패:", error);

      const message =
        error instanceof Error
          ? error.message
          : "포트폴리오 목록을 불러오지 못했습니다.";

      set({
        portfolios: [],
        isLoading: false,
        error: message,
      });
    }
  },

  fetchPortfolioById: async (portfolioId) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const portfolio = await getPortfolioById(portfolioId);

      set({
        selectedPortfolio: portfolio,
        isLoading: false,
      });
    } catch (error) {
      console.error("포트폴리오 상세 조회 실패:", error);

      const message =
        error instanceof Error
          ? error.message
          : "포트폴리오 상세 정보를 불러오지 못했습니다.";

      set({
        selectedPortfolio: null,
        isLoading: false,
        error: message,
      });
    }
  },

  createPortfolio: async (data) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const createdPortfolio = await createPortfolioApi(data);

      set((state) => ({
        portfolios: [
          ...state.portfolios,
          {
            portfolioId: createdPortfolio.portfolioId,
            name: createdPortfolio.name,
            stockCount: createdPortfolio.stockCount,
            totalValuation: createdPortfolio.totalValuation,
          },
        ],
        selectedPortfolio: createdPortfolio,
        isLoading: false,
      }));
    } catch (error) {
      console.error("포트폴리오 생성 실패:", error);

      const message =
        error instanceof Error
          ? error.message
          : "포트폴리오 생성에 실패했습니다.";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  updatePortfolio: async (portfolioId, data) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const updatedPortfolio = await updatePortfolioApi(portfolioId, data);

      set((state) => ({
        portfolios: state.portfolios.map((portfolio) =>
          portfolio.portfolioId === portfolioId
            ? {
                portfolioId: updatedPortfolio.portfolioId,
                name: updatedPortfolio.name,
                stockCount: updatedPortfolio.stockCount,
                totalValuation: updatedPortfolio.totalValuation,
              }
            : portfolio,
        ),
        selectedPortfolio: updatedPortfolio,
        isLoading: false,
      }));
    } catch (error) {
      console.error("포트폴리오 수정 실패:", error);

      const message =
        error instanceof Error
          ? error.message
          : "포트폴리오 수정에 실패했습니다.";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  deletePortfolio: async (portfolioId) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      await deletePortfolioApi(portfolioId);

      set((state) => ({
        portfolios: state.portfolios.filter(
          (portfolio) => portfolio.portfolioId !== portfolioId,
        ),
        selectedPortfolio:
          state.selectedPortfolio?.portfolioId === portfolioId
            ? null
            : state.selectedPortfolio,
        isLoading: false,
      }));
    } catch (error) {
      console.error("포트폴리오 삭제 실패:", error);

      const message =
        error instanceof Error
          ? error.message
          : "포트폴리오 삭제에 실패했습니다.";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  clearSelectedPortfolio: () => {
    set({
      selectedPortfolio: null,
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));
