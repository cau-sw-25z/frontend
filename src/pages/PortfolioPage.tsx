import { usePortfolioStore } from "../store/usePortfolioStore";

export default function PortfolioPage() {
  const portfolioStocks = usePortfolioStore((state) => state.portfolioStocks);

  return (
    <main style={{ padding: 80 }}>
      <h1>내 포트폴리오</h1>

      {portfolioStocks.length === 0 ? (
        <p>담긴 종목이 없습니다.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
          {portfolioStocks.map((stock) => (
            <div
              key={stock.ticker}
              style={{
                padding: 20,
                border: "1px solid #ddd",
                borderRadius: 16,
              }}
            >
              <h2>{stock.name}</h2>
              <p>{stock.ticker}</p>
              <p>${stock.price}</p>
              <p style={{ color: stock.changeRate >= 0 ? "red" : "blue" }}>
                {stock.changeRate >= 0 ? "+" : ""}
                {stock.changeRate}%
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
