import { create } from "zustand";

import {
  addPortfolioStock as addPortfolioStockApi,
  createPortfolio as createPortfolioApi,
  deletePortfolio as deletePortfolioApi,
  deletePortfolioStock as deletePortfolioStockApi,
  getPortfolioById,
  getPortfolios,
  updatePortfolioName as updatePortfolioNameApi,
  type AddPortfolioStockRequest,
  type CreatePortfolioRequest,
  type PortfolioDetail,
  type PortfolioSummary,
  type UpdatePortfolioNameRequest,
} from "../../../common/api/portfolio";

// 기존 mock 종목 상태에서 사용하는 종목 타입
type Stock = {
  ticker: string;
  name: string;
  price: number;
  changeRate: number;
};

// 포트폴리오 Zustand 스토어의 전체 상태와 함수 타입
interface PortfolioState {
  // ========================================
  // 기존 로컬 상태
  // ========================================

  // 사용자가 입력한 총자산
  totalAsset: number;

  // 포트폴리오 생성 과정에서 선택한 종목 코드 목록
  selectedStockIds: string[];

  // 기존 mock 기반 포트폴리오 종목 목록
  portfolioStocks: Stock[];

  // ========================================
  // 서버 포트폴리오 상태
  // ========================================

  // 사용자의 전체 포트폴리오 목록
  portfolios: PortfolioSummary[];

  // 현재 조회하거나 수정 중인 포트폴리오 상세 정보
  selectedPortfolio: PortfolioDetail | null;

  // API 요청 진행 여부
  isLoading: boolean;

  // 가장 최근 API 오류 메시지
  error: string | null;

  // ========================================
  // 기존 로컬 상태 함수
  // ========================================

  // 총자산 설정
  setTotalAsset: (totalAsset: number) => void;

  // 선택 종목 코드 추가
  addSelectedStockId: (stockId: string) => void;

  // 선택 종목 코드 삭제
  removeSelectedStockId: (stockId: string) => void;

  // 선택 종목 코드 전체 초기화
  clearSelectedStockIds: () => void;

  // ========================================
  // 포트폴리오 종목 API 함수
  // ========================================

  // 기존 포트폴리오에 종목 하나 추가
  addStock: (
    portfolioId: number,
    stock: AddPortfolioStockRequest,
  ) => Promise<void>;

  // 기존 포트폴리오에서 종목 하나 삭제
  removeStock: (portfolioId: number, ticker: string) => Promise<void>;

  // ========================================
  // 포트폴리오 API 함수
  // ========================================

  // 포트폴리오 목록 조회
  fetchPortfolios: () => Promise<void>;

  // 포트폴리오 상세 조회
  fetchPortfolioById: (portfolioId: number) => Promise<void>;

  // 포트폴리오 생성
  createPortfolio: (data: CreatePortfolioRequest) => Promise<void>;

  // 포트폴리오 이름 수정
  updatePortfolioName: (
    portfolioId: number,
    data: UpdatePortfolioNameRequest,
  ) => Promise<void>;

  // 포트폴리오 전체 삭제
  deletePortfolio: (portfolioId: number) => Promise<void>;

  // 선택된 포트폴리오 초기화
  clearSelectedPortfolio: () => void;

  // 오류 메시지 초기화
  clearError: () => void;
}

/**
 * API 요청 중 발생한 오류에서 화면에 표시할 메시지를 추출합니다.
 *
 * Axios 응답 인터셉터에서 서버 오류를 Error 객체로 변환하므로
 * 대부분 error.message에 백엔드 메시지가 들어옵니다.
 */
const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

/**
 * 포트폴리오 상세 응답을 바탕으로
 * 목록에 있는 해당 포트폴리오의 요약 정보도 갱신합니다.
 *
 * 종목 추가·삭제 또는 이름 수정 후 서버가 최신 상세 정보를 반환하므로
 * 프론트에서 stockCount와 totalValuation을 직접 계산하지 않습니다.
 */
const updatePortfolioSummary = (
  portfolios: PortfolioSummary[],
  updatedPortfolio: PortfolioDetail,
): PortfolioSummary[] => {
  return portfolios.map((portfolio) =>
    portfolio.portfolioId === updatedPortfolio.portfolioId
      ? {
          // createdAt 등 기존 요약 정보는 유지
          ...portfolio,

          // 서버에서 반환한 최신 이름으로 변경
          name: updatedPortfolio.name,

          // 서버에서 계산한 최신 종목 수로 변경
          stockCount: updatedPortfolio.stockCount,

          // 서버에서 계산한 최신 평가금액으로 변경
          totalValuation: updatedPortfolio.totalValuation,
        }
      : portfolio,
  );
};

export const usePortfolioStore = create<PortfolioState>((set) => ({
  // ========================================
  // 초기 로컬 상태
  // ========================================

  totalAsset: 0,

  selectedStockIds: [],

  portfolioStocks: [],

  // ========================================
  // 초기 서버 상태
  // ========================================

  portfolios: [],

  selectedPortfolio: null,

  isLoading: false,

  error: null,

  // ========================================
  // 기존 로컬 상태 함수
  // ========================================

  setTotalAsset: (totalAsset) => {
    set({
      totalAsset,
    });
  },

  addSelectedStockId: (stockId) => {
    set((state) => {
      // 이미 선택된 종목이면 중복으로 추가하지 않음
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

  // ========================================
  // 포트폴리오 종목 추가
  // POST /api/portfolio/{portfolioId}/stocks
  // ========================================

  addStock: async (portfolioId, stock) => {
    // 요청 시작 전에 로딩 상태를 켜고 기존 오류를 초기화
    set({
      isLoading: true,
      error: null,
    });

    try {
      /*
       * 기존 방식처럼 포트폴리오 상세를 먼저 조회하거나
       * 종목 배열 전체를 다시 만들어 PUT으로 보내지 않습니다.
       *
       * 새 종목 추가 전용 API에 추가할 종목 한 개만 전달합니다.
       */
      const updatedPortfolio = await addPortfolioStockApi(portfolioId, stock);

      set((state) => ({
        // 서버가 반환한 최신 포트폴리오 상세 정보 저장
        selectedPortfolio: updatedPortfolio,

        // 목록 화면에 표시되는 요약 정보도 갱신
        portfolios: updatePortfolioSummary(state.portfolios, updatedPortfolio),

        // 요청 완료
        isLoading: false,

        // 이전 오류 제거
        error: null,
      }));
    } catch (error) {
      console.error("포트폴리오 종목 추가 실패:", error);

      /*
       * 백엔드 중복 종목 오류 예시:
       *
       * code: PORTFOLIO_ITEM_400_DUPLICATE
       * message: 이미 포트폴리오에 등록된 종목입니다.
       *
       * axiosInstance가 서버 message를 Error.message로 변환하므로
       * 해당 메시지가 여기서 상태에 저장됩니다.
       */
      const message = getErrorMessage(
        error,
        "포트폴리오에 종목을 추가하지 못했습니다.",
      );

      set({
        isLoading: false,
        error: message,
      });

      // 컴포넌트에서도 실패를 처리할 수 있도록 다시 던짐
      throw error;
    }
  },

  // ========================================
  // 포트폴리오 종목 삭제
  // DELETE /api/portfolio/{portfolioId}/stocks/{ticker}
  // ========================================

  removeStock: async (portfolioId, ticker) => {
    // 요청 시작
    set({
      isLoading: true,
      error: null,
    });

    try {
      /*
       * 삭제 후 남은 종목 배열을 프론트에서 직접 만들지 않습니다.
       * 포트폴리오 ID와 삭제할 ticker만 서버로 전달합니다.
       */
      const updatedPortfolio = await deletePortfolioStockApi(
        portfolioId,
        ticker,
      );

      set((state) => ({
        // 삭제 후 서버가 반환한 최신 상세 정보 저장
        selectedPortfolio: updatedPortfolio,

        // 포트폴리오 목록의 종목 수와 평가금액도 갱신
        portfolios: updatePortfolioSummary(state.portfolios, updatedPortfolio),

        isLoading: false,

        error: null,
      }));
    } catch (error) {
      console.error("포트폴리오 종목 삭제 실패:", error);

      const message = getErrorMessage(
        error,
        "포트폴리오에서 종목을 삭제하지 못했습니다.",
      );

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  // ========================================
  // 포트폴리오 목록 조회
  // GET /api/portfolio
  // ========================================

  fetchPortfolios: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      // 서버에서 사용자의 전체 포트폴리오 목록 조회
      const portfolios = await getPortfolios();

      set({
        portfolios,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("포트폴리오 목록 조회 실패:", error);

      const message = getErrorMessage(
        error,
        "포트폴리오 목록을 불러오지 못했습니다.",
      );

      set({
        // 조회 실패 시 잘못된 이전 목록을 보여주지 않도록 비움
        portfolios: [],

        isLoading: false,

        error: message,
      });
    }
  },

  // ========================================
  // 포트폴리오 상세 조회
  // GET /api/portfolio/{portfolioId}
  // ========================================

  fetchPortfolioById: async (portfolioId) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      // 특정 포트폴리오의 상세 정보 조회
      const portfolio = await getPortfolioById(portfolioId);

      set({
        selectedPortfolio: portfolio,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("포트폴리오 상세 조회 실패:", error);

      const message = getErrorMessage(
        error,
        "포트폴리오 상세 정보를 불러오지 못했습니다.",
      );

      set({
        // 이전에 선택했던 상세 정보가 남지 않도록 초기화
        selectedPortfolio: null,

        isLoading: false,

        error: message,
      });
    }
  },

  // ========================================
  // 포트폴리오 생성
  // POST /api/portfolio
  // ========================================

  createPortfolio: async (data) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      /*
       * 새 포트폴리오 생성 요청
       *
       * data 예시:
       * {
       *   name: "장기 투자",
       *   items: [
       *     {
       *       ticker: "005930",
       *       avgPrice: 70000,
       *       quantity: 10
       *     }
       *   ]
       * }
       */
      const createdPortfolio = await createPortfolioApi(data);

      set((state) => ({
        // 생성된 포트폴리오를 목록 마지막에 추가
        portfolios: [
          ...state.portfolios,
          {
            portfolioId: createdPortfolio.portfolioId,
            name: createdPortfolio.name,
            stockCount: createdPortfolio.stockCount,
            totalValuation: createdPortfolio.totalValuation,
          },
        ],

        // 방금 생성한 포트폴리오를 선택된 상세 정보로 저장
        selectedPortfolio: createdPortfolio,

        isLoading: false,

        error: null,
      }));
    } catch (error) {
      console.error("포트폴리오 생성 실패:", error);

      const message = getErrorMessage(error, "포트폴리오 생성에 실패했습니다.");

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  // ========================================
  // 포트폴리오 이름 수정
  // PUT /api/portfolio/{portfolioId}
  // ========================================

  updatePortfolioName: async (portfolioId, data) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      /*
       * 이름 수정 API에는 종목 배열을 보내지 않습니다.
       *
       * data 예시:
       * {
       *   name: "수정된 포트폴리오명"
       * }
       */
      const updatedPortfolio = await updatePortfolioNameApi(portfolioId, data);

      set((state) => ({
        // 목록에 있는 해당 포트폴리오 정보 갱신
        portfolios: updatePortfolioSummary(state.portfolios, updatedPortfolio),

        // 상세 정보도 서버 응답으로 갱신
        selectedPortfolio: updatedPortfolio,

        isLoading: false,

        error: null,
      }));
    } catch (error) {
      console.error("포트폴리오 이름 수정 실패:", error);

      const message = getErrorMessage(
        error,
        "포트폴리오 이름 수정에 실패했습니다.",
      );

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  // ========================================
  // 포트폴리오 전체 삭제
  // DELETE /api/portfolio/{portfolioId}
  // ========================================

  deletePortfolio: async (portfolioId) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      // 서버에서 포트폴리오 전체 삭제
      await deletePortfolioApi(portfolioId);

      set((state) => ({
        // 삭제한 포트폴리오를 목록에서 제거
        portfolios: state.portfolios.filter(
          (portfolio) => portfolio.portfolioId !== portfolioId,
        ),

        /*
         * 현재 선택된 상세 포트폴리오가
         * 방금 삭제한 포트폴리오라면 null로 초기화
         */
        selectedPortfolio:
          state.selectedPortfolio?.portfolioId === portfolioId
            ? null
            : state.selectedPortfolio,

        isLoading: false,

        error: null,
      }));
    } catch (error) {
      console.error("포트폴리오 삭제 실패:", error);

      const message = getErrorMessage(error, "포트폴리오 삭제에 실패했습니다.");

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  // ========================================
  // 상태 초기화 함수
  // ========================================

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
