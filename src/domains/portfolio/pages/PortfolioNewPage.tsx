import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePortfolioStore } from "../store/usePortfolioStore";

// 화면에서 선택한 종목의 입력값 타입
// input 값은 입력 중 빈 문자열일 수 있으므로 string으로 관리
type SelectedStock = {
  name: string;
  ticker: string;
  avgPrice: string;
  quantity: string;
};

// 현재 화면에 임시로 표시할 mock 종목 타입
type MockStock = {
  name: string;
  ticker: string;
};

// TODO:
// 추후 종목 조회 API가 연결되면 mockStocks 대신
// 서버에서 받아온 종목 목록을 사용해야 함
const mockStocks: MockStock[] = [
  { name: "삼성전자", ticker: "005930" },
  { name: "NAVER", ticker: "035420" },
  { name: "카카오", ticker: "035720" },
  { name: "현대차", ticker: "005380" },
];

export default function PortfolioNewPage() {
  // 포트폴리오 생성 성공 후 목록 페이지로 이동하기 위한 함수
  const navigate = useNavigate();

  // Zustand 스토어의 포트폴리오 생성 함수
  const createPortfolio = usePortfolioStore((state) => state.createPortfolio);

  // API 요청 진행 여부
  const isLoading = usePortfolioStore((state) => state.isLoading);

  // 스토어에 저장된 API 오류 메시지
  const storeError = usePortfolioStore((state) => state.error);

  // 이전 오류 상태를 초기화하는 함수
  const clearError = usePortfolioStore((state) => state.clearError);

  // 사용자가 입력한 포트폴리오 이름
  const [portfolioName, setPortfolioName] = useState("");

  // 사용자가 선택한 종목과 각 종목의 평균 매수가·수량
  const [selectedStocks, setSelectedStocks] = useState<SelectedStock[]>([]);

  // 현재 페이지에서 발생한 입력 검증 오류
  const [validationError, setValidationError] = useState<string | null>(null);

  // 페이지를 처음 열거나 나갈 때 이전 API 오류를 초기화
  useEffect(() => {
    clearError();

    return () => {
      clearError();
    };
  }, [clearError]);

  /**
   * 종목 선택
   *
   * 이미 선택된 ticker라면 중복으로 추가하지 않음
   */
  const handleSelectStock = (stock: MockStock) => {
    const isDuplicate = selectedStocks.some(
      (selectedStock) => selectedStock.ticker === stock.ticker,
    );

    if (isDuplicate) {
      return;
    }

    setSelectedStocks((currentStocks) => [
      ...currentStocks,
      {
        name: stock.name,
        ticker: stock.ticker,
        avgPrice: "",
        quantity: "",
      },
    ]);

    setValidationError(null);
    clearError();
  };

  /**
   * 선택한 종목 제거
   */
  const handleRemoveStock = (ticker: string) => {
    setSelectedStocks((currentStocks) =>
      currentStocks.filter((stock) => stock.ticker !== ticker),
    );

    setValidationError(null);
    clearError();
  };

  /**
   * 평균 매수가 또는 보유 수량 입력 처리
   */
  const handleStockInputChange = (
    ticker: string,
    field: "avgPrice" | "quantity",
    value: string,
  ) => {
    /*
     * avgPrice는 백엔드 DECIMAL(15,2)
     *
     * 전체 15자리 중 소수부가 2자리이므로
     * 정수부는 최대 13자리까지 허용
     *
     * 허용 예:
     * 70000
     * 70000.5
     * 70000.50
     */
    if (field === "avgPrice" && !/^\d{0,13}(\.\d{0,2})?$/.test(value)) {
      return;
    }

    /*
     * quantity는 백엔드 Integer/INT
     *
     * 정수 숫자만 허용하고 소수점은 허용하지 않음
     */
    if (field === "quantity" && !/^\d*$/.test(value)) {
      return;
    }

    setSelectedStocks((currentStocks) =>
      currentStocks.map((stock) =>
        stock.ticker === ticker
          ? {
              ...stock,
              [field]: value,
            }
          : stock,
      ),
    );

    setValidationError(null);
    clearError();
  };

  /**
   * 포트폴리오 생성 요청
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // form 기본 새로고침 동작 방지
    event.preventDefault();

    // 이름 양쪽 공백 제거
    const trimmedName = portfolioName.trim();

    // 포트폴리오 이름 검증
    if (!trimmedName) {
      setValidationError("포트폴리오 이름을 입력해주세요.");
      return;
    }

    // 종목 선택 여부 검증
    if (selectedStocks.length < 1) {
      setValidationError("종목을 최소 1개 이상 선택해주세요.");
      return;
    }

    /*
     * 각 종목의 평균 매수가와 수량 검증
     *
     * avgPrice:
     * - 값 필수
     * - 유한한 숫자
     * - 0보다 큼
     * - 소수점 둘째 자리까지
     *
     * quantity:
     * - 값 필수
     * - 유한한 숫자
     * - 1 이상의 정수
     */
    const invalidStock = selectedStocks.find((stock) => {
      const parsedAvgPrice = Number(stock.avgPrice);
      const parsedQuantity = Number(stock.quantity);

      const isValidAvgPrice =
        stock.avgPrice !== "" &&
        Number.isFinite(parsedAvgPrice) &&
        parsedAvgPrice > 0 &&
        /^\d{1,13}(\.\d{1,2})?$/.test(stock.avgPrice);

      const isValidQuantity =
        stock.quantity !== "" &&
        Number.isFinite(parsedQuantity) &&
        Number.isInteger(parsedQuantity) &&
        parsedQuantity > 0;

      return !isValidAvgPrice || !isValidQuantity;
    });

    if (invalidStock) {
      setValidationError(
        `${invalidStock.name}의 평균 매수가는 0보다 큰 숫자, 보유 수량은 1 이상의 정수로 입력해주세요.`,
      );
      return;
    }

    try {
      // 요청 전 기존 오류 초기화
      setValidationError(null);
      clearError();

      /*
       * POST /api/portfolio
       *
       * 요청 예:
       * {
       *   name: "장기 성장 포트폴리오",
       *   items: [
       *     {
       *       ticker: "005930",
       *       avgPrice: 70000,
       *       quantity: 10
       *     }
       *   ]
       * }
       */
      await createPortfolio({
        name: trimmedName,
        items: selectedStocks.map((stock) => ({
          ticker: stock.ticker,
          avgPrice: Number(stock.avgPrice),
          quantity: Number(stock.quantity),
        })),
      });

      window.alert("포트폴리오가 저장되었습니다.");

      // 생성 성공 후 포트폴리오 목록 페이지로 이동
      navigate("/portfolio");
    } catch (error) {
      console.error("포트폴리오 생성 실패:", error);

      /*
       * usePortfolioStore와 axiosInstance에서 이미
       * 백엔드 message를 Error.message로 변환함
       */
      const message =
        error instanceof Error
          ? error.message
          : "포트폴리오 저장에 실패했습니다.";

      setValidationError(message);
    }
  };

  // 입력 검증 오류를 우선 표시하고, 없으면 스토어 오류 표시
  const displayedError = validationError ?? storeError;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm"
      >
        {/* 페이지 제목 */}
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          포트폴리오 생성
        </h1>

        <p className="mb-8 text-sm text-gray-500">
          보유 종목과 평균 매수가, 수량을 입력해 포트폴리오를 만들어보세요.
        </p>

        {/* 포트폴리오 이름 */}
        <div className="mb-6">
          <label
            htmlFor="portfolio-name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            포트폴리오 이름
          </label>

          <input
            id="portfolio-name"
            type="text"
            value={portfolioName}
            disabled={isLoading}
            onChange={(event) => {
              setPortfolioName(event.target.value);
              setValidationError(null);
              clearError();
            }}
            placeholder="예: 장기 성장 포트폴리오"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        {/* 종목 선택 */}
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-medium text-gray-700">종목 선택</h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {mockStocks.map((stock) => {
              const isSelected = selectedStocks.some(
                (selectedStock) => selectedStock.ticker === stock.ticker,
              );

              return (
                <button
                  type="button"
                  key={stock.ticker}
                  disabled={isLoading || isSelected}
                  onClick={() => handleSelectStock(stock)}
                  className={`rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                  } disabled:cursor-not-allowed disabled:opacity-70`}
                >
                  <p className="font-semibold text-gray-900">{stock.name}</p>

                  <p className="text-sm text-gray-500">{stock.ticker}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* 선택 종목 입력 */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-medium text-gray-700">
            선택된 종목
          </h2>

          {selectedStocks.length === 0 ? (
            <p className="rounded-xl bg-gray-100 p-4 text-sm text-gray-500">
              아직 선택된 종목이 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedStocks.map((stock) => {
                const estimatedPurchaseAmount =
                  Number(stock.avgPrice) * Number(stock.quantity);

                return (
                  <article
                    key={stock.ticker}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    {/* 종목 이름과 제거 버튼 */}
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {stock.name}
                        </p>

                        <p className="text-sm text-gray-500">{stock.ticker}</p>
                      </div>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleRemoveStock(stock.ticker)}
                        className="text-sm text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        제거
                      </button>
                    </div>

                    {/* 평균 매수가와 보유 수량 입력 */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {/* 평균 매수가 */}
                      <div>
                        <label
                          htmlFor={`avg-price-${stock.ticker}`}
                          className="mb-1 block text-xs font-medium text-gray-600"
                        >
                          평균 매수가
                        </label>

                        <div className="relative">
                          <input
                            id={`avg-price-${stock.ticker}`}
                            type="text"
                            inputMode="decimal"
                            value={stock.avgPrice}
                            disabled={isLoading}
                            onChange={(event) =>
                              handleStockInputChange(
                                stock.ticker,
                                "avgPrice",
                                event.target.value,
                              )
                            }
                            placeholder="예: 70000.50"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-9 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
                          />

                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                            원
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          소수점 둘째 자리까지 입력할 수 있습니다.
                        </p>
                      </div>

                      {/* 보유 수량 */}
                      <div>
                        <label
                          htmlFor={`quantity-${stock.ticker}`}
                          className="mb-1 block text-xs font-medium text-gray-600"
                        >
                          보유 수량
                        </label>

                        <div className="relative">
                          <input
                            id={`quantity-${stock.ticker}`}
                            type="text"
                            inputMode="numeric"
                            value={stock.quantity}
                            disabled={isLoading}
                            onChange={(event) =>
                              handleStockInputChange(
                                stock.ticker,
                                "quantity",
                                event.target.value,
                              )
                            }
                            placeholder="예: 10"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-9 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
                          />

                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                            주
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                          1 이상의 정수만 입력할 수 있습니다.
                        </p>
                      </div>
                    </div>

                    {/* 예상 매수 금액 */}
                    {Number(stock.avgPrice) > 0 &&
                      Number(stock.quantity) > 0 && (
                        <p className="mt-3 text-right text-sm text-gray-500">
                          매수 금액{" "}
                          <strong className="text-gray-900">
                            {estimatedPurchaseAmount.toLocaleString()}원
                          </strong>
                        </p>
                      )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* 오류 메시지 */}
        {displayedError && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {displayedError}
          </p>
        )}

        {/* 하단 버튼 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => navigate("/portfolio")}
            className="rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            취소
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isLoading ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    </main>
  );
}
