const createChartData = (basePrice: number) =>
  Array.from({ length: 30 }, (_, index) => ({
    time: `2026-05-${String(index + 1).padStart(2, "0")}`,
    value: Number((basePrice + Math.sin(index) * 5 + index * 0.4).toFixed(2)),
  }));

export const mockStocks = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 189.98,
    changeRate: 1.24,
    sector: "Technology",
    marketCap: "2.94T",
    description:
      "iPhone, Mac, iPad 등 하드웨어와 소프트웨어 서비스를 제공하는 글로벌 기술 기업입니다.",
    chartData: createChartData(180),
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    price: 177.46,
    changeRate: -2.13,
    sector: "Automotive",
    marketCap: "565B",
    description:
      "전기차, 에너지 저장장치, 자율주행 기술을 중심으로 성장하는 기업입니다.",
    chartData: createChartData(170),
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    price: 924.79,
    changeRate: 3.58,
    sector: "Semiconductor",
    marketCap: "2.28T",
    description:
      "GPU, AI 반도체, 데이터센터 솔루션을 제공하는 반도체 기업입니다.",
    chartData: createChartData(900),
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp.",
    price: 421.9,
    changeRate: 0.87,
    sector: "Technology",
    marketCap: "3.13T",
    description:
      "Windows, Office, Azure 클라우드 서비스를 제공하는 글로벌 소프트웨어 기업입니다.",
    chartData: createChartData(410),
  },
];
