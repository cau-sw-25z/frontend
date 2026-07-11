import { useState } from "react";

type SelectedStock = {
  name: string;
  ticker: string;
};

const mockStocks: SelectedStock[] = [
  { name: "삼성전자", ticker: "005930" },
  { name: "NAVER", ticker: "035420" },
  { name: "카카오", ticker: "035720" },
  { name: "현대차", ticker: "005380" },
];

export default function PortfolioNewPage() {
  const [portfolioName, setPortfolioName] = useState("");
  const [selectedStocks, setSelectedStocks] = useState<SelectedStock[]>([]);

  const handleSelectStock = (stock: SelectedStock) => {
    const isDuplicate = selectedStocks.some(
      (item) => item.ticker === stock.ticker,
    );

    if (isDuplicate) return;

    setSelectedStocks([...selectedStocks, stock]);
  };

  const handleRemoveStock = (ticker: string) => {
    setSelectedStocks(
      selectedStocks.filter((stock) => stock.ticker !== ticker),
    );
  };

  const handleSubmit = () => {
    if (!portfolioName.trim()) {
      alert("포트폴리오 이름을 입력해주세요.");
      return;
    }

    if (selectedStocks.length < 1) {
      alert("종목을 최소 1개 이상 선택해주세요.");
      return;
    }

    console.log({
      name: portfolioName,
      stocks: selectedStocks,
    });

    alert("포트폴리오가 저장되었습니다.");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          포트폴리오 생성
        </h1>
        <p className="mb-8 text-sm text-gray-500">
          관심 있는 종목을 선택해 나만의 포트폴리오를 만들어보세요.
        </p>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            포트폴리오 이름
          </label>
          <input
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            placeholder="예: 장기 성장 포트폴리오"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <h2 className="mb-3 text-sm font-medium text-gray-700">종목 선택</h2>

          <div className="grid grid-cols-2 gap-3">
            {mockStocks.map((stock) => (
              <button
                key={stock.ticker}
                onClick={() => handleSelectStock(stock)}
                className="rounded-xl border border-gray-200 p-4 text-left hover:border-blue-500 hover:bg-blue-50"
              >
                <p className="font-semibold text-gray-900">{stock.name}</p>
                <p className="text-sm text-gray-500">{stock.ticker}</p>
              </button>
            ))}
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
            <div className="space-y-2">
              {selectedStocks.map((stock) => (
                <div
                  key={stock.ticker}
                  className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{stock.name}</p>
                    <p className="text-sm text-gray-500">{stock.ticker}</p>
                  </div>

                  <button
                    onClick={() => handleRemoveStock(stock.ticker)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    제거
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
