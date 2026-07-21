import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePortfolioStore } from "../store/usePortfolioStore";

type SelectedStock = {
  name: string;
  ticker: string;
  avgPrice: string;
  quantity: string;
};

type MockStock = {
  name: string;
  ticker: string;
};

const mockStocks: MockStock[] = [
  { name: "삼성전자", ticker: "005930" },
  { name: "NAVER", ticker: "035420" },
  { name: "카카오", ticker: "035720" },
  { name: "현대차", ticker: "005380" },
];

export default function PortfolioNewPage() {
  const navigate = useNavigate();

  const createPortfolio = usePortfolioStore((state) => state.createPortfolio);

  const isLoading = usePortfolioStore((state) => state.isLoading);

  const [portfolioName, setPortfolioName] = useState("");
  const [selectedStocks, setSelectedStocks] = useState<SelectedStock[]>([]);

  const handleSelectStock = (stock: MockStock) => {
    const isDuplicate = selectedStocks.some(
      (item) => item.ticker === stock.ticker,
    );

    if (isDuplicate) {
      return;
    }

    setSelectedStocks((currentStocks) => [
      ...currentStocks,
      {
        ...stock,
        avgPrice: "",
        quantity: "",
      },
    ]);
  };

  const handleRemoveStock = (ticker: string) => {
    setSelectedStocks((currentStocks) =>
      currentStocks.filter((stock) => stock.ticker !== ticker),
    );
  };

  const handleStockInputChange = (
    ticker: string,
    field: "avgPrice" | "quantity",
    value: string,
  ) => {
    // 숫자와 소수점만 입력 허용
    if (!/^\d*\.?\d*$/.test(value)) {
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
  };

  const handleSubmit = async () => {
    const trimmedName = portfolioName.trim();

    if (!trimmedName) {
      alert("포트폴리오 이름을 입력해주세요.");
      return;
    }

    if (selectedStocks.length < 1) {
      alert("종목을 최소 1개 이상 선택해주세요.");
      return;
    }

    const invalidStock = selectedStocks.find((stock) => {
      const avgPrice = Number(stock.avgPrice);
      const quantity = Number(stock.quantity);

      return (
        !stock.avgPrice ||
        !stock.quantity ||
        !Number.isFinite(avgPrice) ||
        !Number.isFinite(quantity) ||
        avgPrice <= 0 ||
        quantity <= 0
      );
    });

    if (invalidStock) {
      alert(
        `${invalidStock.name}의 평균 매수가와 수량을 0보다 크게 입력해주세요.`,
      );
      return;
    }

    try {
      await createPortfolio({
        name: trimmedName,
        items: selectedStocks.map((stock) => ({
          ticker: stock.ticker,
          avgPrice: Number(stock.avgPrice),
          quantity: Number(stock.quantity),
        })),
      });

      alert("포트폴리오가 저장되었습니다.");
      navigate("/portfolio");
    } catch (error) {
      console.error("포트폴리오 생성 실패:", error);

      const message =
        error instanceof Error
          ? error.message
          : "포트폴리오 저장에 실패했습니다.";

      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          포트폴리오 생성
        </h1>

        <p className="mb-8 text-sm text-gray-500">
          보유 종목과 평균 매수가, 수량을 입력해 포트폴리오를 만들어보세요.
        </p>

        <div className="mb-6">
          <label
            htmlFor="portfolio-name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            포트폴리오 이름
          </label>

          <input
            id="portfolio-name"
            value={portfolioName}
            disabled={isLoading}
            onChange={(event) => setPortfolioName(event.target.value)}
            placeholder="예: 장기 성장 포트폴리오"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div className="mb-6">
          <h2 className="mb-3 text-sm font-medium text-gray-700">종목 선택</h2>

          <div className="grid grid-cols-2 gap-3">
            {mockStocks.map((stock) => {
              const isSelected = selectedStocks.some(
                (item) => item.ticker === stock.ticker,
              );

              return (
                <button
                  type="button"
                  key={stock.ticker}
                  disabled={isLoading || isSelected}
                  onClick={() => handleSelectStock(stock)}
                  className={`rounded-xl border p-4 text-left ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                  } disabled:cursor-not-allowed`}
                >
                  <p className="font-semibold text-gray-900">{stock.name}</p>

                  <p className="text-sm text-gray-500">{stock.ticker}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-3 text-sm font-medium text-gray-700">
            선택된 종목
          </h2>

          {selectedStocks.length === 0 ? (
            <p className="rounded-xl bg-gray-100 p-4 text-sm text-gray-500">
              아직 선택된 종목이 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedStocks.map((stock) => (
                <div
                  key={stock.ticker}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{stock.name}</p>

                      <p className="text-sm text-gray-500">{stock.ticker}</p>
                    </div>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleRemoveStock(stock.ticker)}
                      className="text-sm text-red-500 hover:underline disabled:opacity-50"
                    >
                      제거
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
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
                          placeholder="예: 70000"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
                        />

                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          원
                        </span>
                      </div>
                    </div>

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
                          inputMode="decimal"
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
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
                        />

                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          주
                        </span>
                      </div>
                    </div>
                  </div>

                  {Number(stock.avgPrice) > 0 && Number(stock.quantity) > 0 && (
                    <p className="mt-3 text-right text-sm text-gray-500">
                      매수 금액{" "}
                      <strong className="text-gray-900">
                        {(
                          Number(stock.avgPrice) * Number(stock.quantity)
                        ).toLocaleString()}
                        원
                      </strong>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => void handleSubmit()}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </div>
  );
}
