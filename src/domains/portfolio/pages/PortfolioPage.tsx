import { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePortfolioStore } from "../store/usePortfolioStore";

export default function PortfolioPage() {
  const portfolios = usePortfolioStore((state) => state.portfolios);
  const isLoading = usePortfolioStore((state) => state.isLoading);
  const error = usePortfolioStore((state) => state.error);

  const fetchPortfolios = usePortfolioStore((state) => state.fetchPortfolios);

  const deletePortfolio = usePortfolioStore((state) => state.deletePortfolio);

  useEffect(() => {
    void fetchPortfolios();
  }, [fetchPortfolios]);

  const totalPortfolioCount = portfolios.length;

  const totalStockCount = portfolios.reduce(
    (sum, portfolio) => sum + Number(portfolio.stockCount ?? 0),
    0,
  );

  const totalValuation = portfolios.reduce(
    (sum, portfolio) => sum + Number(portfolio.totalValuation ?? 0),
    0,
  );

  const handleDelete = async (portfolioId: number, portfolioName: string) => {
    const isConfirmed = window.confirm(
      `"${portfolioName}" 포트폴리오를 삭제하시겠습니까?`,
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await deletePortfolio(portfolioId);
      alert("포트폴리오가 삭제되었습니다.");
    } catch {
      alert("포트폴리오 삭제에 실패했습니다.");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 80,
        backgroundColor: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 30,
                color: "#111827",
              }}
            >
              내 포트폴리오
            </h1>

            <p
              style={{
                marginTop: 10,
                marginBottom: 0,
                color: "#6b7280",
              }}
            >
              생성한 포트폴리오와 평가금액을 확인해보세요.
            </p>
          </div>

          <Link
            to="/portfolio/new"
            style={{
              display: "inline-block",
              padding: "12px 18px",
              borderRadius: 12,
              backgroundColor: "#2563eb",
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            + 새 포트폴리오
          </Link>
        </div>

        <Link
          to="/stocks"
          style={{
            display: "inline-block",
            marginBottom: 24,
            padding: "10px 16px",
            border: "1px solid #ddd",
            borderRadius: 12,
            backgroundColor: "#fff",
            color: "#333",
            textDecoration: "none",
          }}
        >
          ← 종목으로 돌아가기
        </Link>

        {!isLoading && !error && portfolios.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                padding: 20,
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                backgroundColor: "#fff",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: 14,
                }}
              >
                포트폴리오
              </p>

              <strong
                style={{
                  display: "block",
                  marginTop: 8,
                  fontSize: 24,
                  color: "#111827",
                }}
              >
                {totalPortfolioCount}개
              </strong>
            </div>

            <div
              style={{
                padding: 20,
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                backgroundColor: "#fff",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: 14,
                }}
              >
                전체 종목 수
              </p>

              <strong
                style={{
                  display: "block",
                  marginTop: 8,
                  fontSize: 24,
                  color: "#111827",
                }}
              >
                {totalStockCount}개
              </strong>
            </div>

            <div
              style={{
                padding: 20,
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                backgroundColor: "#fff",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: 14,
                }}
              >
                총 평가금액
              </p>

              <strong
                style={{
                  display: "block",
                  marginTop: 8,
                  fontSize: 24,
                  color: "#2563eb",
                }}
              >
                {totalValuation.toLocaleString()}원
              </strong>
            </div>
          </div>
        )}

        {isLoading && portfolios.length === 0 ? (
          <div
            style={{
              padding: 40,
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              backgroundColor: "#fff",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            포트폴리오를 불러오는 중입니다.
          </div>
        ) : error ? (
          <div
            style={{
              padding: 40,
              border: "1px solid #fecaca",
              borderRadius: 16,
              backgroundColor: "#fff",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#ef4444",
              }}
            >
              {error}
            </p>

            <button
              type="button"
              onClick={() => void fetchPortfolios()}
              style={{
                marginTop: 16,
                padding: "10px 16px",
                border: "1px solid #d1d5db",
                borderRadius: 10,
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
            >
              다시 시도
            </button>
          </div>
        ) : portfolios.length === 0 ? (
          <div
            style={{
              padding: 48,
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              backgroundColor: "#fff",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#6b7280",
              }}
            >
              아직 생성된 포트폴리오가 없습니다.
            </p>

            <Link
              to="/portfolio/new"
              style={{
                display: "inline-block",
                marginTop: 18,
                padding: "11px 17px",
                borderRadius: 12,
                backgroundColor: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              첫 포트폴리오 만들기
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 20,
            }}
          >
            {portfolios.map((portfolio) => {
              const stockCount = Number(portfolio.stockCount ?? 0);

              const valuation = Number(portfolio.totalValuation ?? 0);

              const stockBarWidth = Math.min(stockCount * 10, 100);

              return (
                <div
                  key={portfolio.portfolioId}
                  style={{
                    padding: 24,
                    border: "1px solid #ddd",
                    borderRadius: 16,
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 20,
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          margin: 0,
                          color: "#111827",
                        }}
                      >
                        {portfolio.name || "이름 없는 포트폴리오"}
                      </h2>

                      <p
                        style={{
                          marginTop: 8,
                          marginBottom: 0,
                          color: "#666",
                        }}
                      >
                        총 {stockCount}개 종목
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      <Link
                        to={`/portfolio/${portfolio.portfolioId}`}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #bfdbfe",
                          borderRadius: 10,
                          color: "#2563eb",
                          fontSize: 14,
                          textDecoration: "none",
                        }}
                      >
                        상세보기
                      </Link>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          void handleDelete(
                            portfolio.portfolioId,
                            portfolio.name,
                          )
                        }
                        style={{
                          padding: "8px 12px",
                          border: "none",
                          backgroundColor: "transparent",
                          color: "#ef4444",
                          cursor: isLoading ? "not-allowed" : "pointer",
                          fontSize: 14,
                          opacity: isLoading ? 0.5 : 1,
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      gap: 20,
                      marginTop: 24,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          color: "#6b7280",
                          fontSize: 14,
                        }}
                      >
                        총 평가금액
                      </p>

                      <strong
                        style={{
                          display: "block",
                          marginTop: 6,
                          color: "#111827",
                          fontSize: 22,
                        }}
                      >
                        {valuation.toLocaleString()}원
                      </strong>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        color: "#9ca3af",
                        fontSize: 13,
                      }}
                    >
                      생성일{" "}
                      {portfolio.createdAt
                        ? new Date(portfolio.createdAt).toLocaleDateString(
                            "ko-KR",
                          )
                        : "-"}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 7,
                        color: "#6b7280",
                        fontSize: 13,
                      }}
                    >
                      <span>보유 종목 현황</span>
                      <span>{stockCount}개</span>
                    </div>

                    <div
                      style={{
                        height: 8,
                        backgroundColor: "#eee",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${stockBarWidth}%`,
                          minWidth: stockCount > 0 ? 8 : 0,
                          height: "100%",
                          backgroundColor: "#2563eb",
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
