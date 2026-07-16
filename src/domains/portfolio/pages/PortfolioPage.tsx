import { Link } from "react-router-dom";
import { usePortfolioStore } from "../store/usePortfolioStore";

export default function PortfolioPage() {
  const portfolioStocks = usePortfolioStore((state) => state.portfolioStocks);

  const totalStocks = portfolioStocks.length;
  const stockWeight = totalStocks > 0 ? Math.floor(100 / totalStocks) : 0;
  const removeStock = usePortfolioStore((state) => state.removeStock);

  return (
    <main style={{ padding: 80 }}>
      <h1>내 포트폴리오</h1>
      <Link
        to="/stocks"
        style={{
          display: "inline-block",
          marginTop: 16,
          padding: "10px 16px",
          border: "1px solid #ddd",
          borderRadius: 12,
          textDecoration: "none",
          color: "#333",
        }}
      >
        ← 종목으로 돌아가기
      </Link>

      {portfolioStocks.length === 0 ? (
        <p>담긴 종목이 없습니다.</p>
      ) : (
        <div style={{ display: "grid", gap: 20, marginTop: 20 }}>
          <div
            style={{
              padding: 24,
              border: "1px solid #ddd",
              borderRadius: 16,
              backgroundColor: "#fff",
            }}
          >
            <h2>나의 포트폴리오</h2>

            <p style={{ color: "#666" }}>총 {totalStocks}개 종목</p>

            <div style={{ marginTop: 20, display: "grid", gap: 14 }}>
              {portfolioStocks.map((stock) => (
                <div key={stock.ticker}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span>
                      {stock.name} ({stock.ticker})
                    </span>
                    <div
                      style={{ display: "flex", gap: 12, alignItems: "center" }}
                    >
                      <span>{stockWeight}%</span>

                      <button
                        onClick={() => removeStock(stock.ticker)}
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontSize: 14,
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      height: 8,
                      backgroundColor: "#eee",
                      borderRadius: 999,
                    }}
                  >
                    <div
                      style={{
                        width: `${stockWeight}%`,
                        height: "100%",
                        backgroundColor: "#2563eb",
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
