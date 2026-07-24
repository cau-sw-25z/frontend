import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createChart, LineSeries } from "lightweight-charts";

import { usePortfolioStore } from "@/domains/portfolio/store/usePortfolioStore";
import { mockStocks } from "@/mocks/stocks";

export default function StockDetailPage() {
  const navigate = useNavigate();
  const { ticker } = useParams();

  const chartRef = useRef<HTMLDivElement | null>(null);

  const stock = mockStocks.find((item) => item.ticker === ticker);

  const portfolios = usePortfolioStore((state) => state.portfolios);

  const fetchPortfolios = usePortfolioStore((state) => state.fetchPortfolios);

  const addStock = usePortfolioStore((state) => state.addStock);

  const isLoading = usePortfolioStore((state) => state.isLoading);

  const storeError = usePortfolioStore((state) => state.error);

  const clearError = usePortfolioStore((state) => state.clearError);

  const [selectedPortfolioId, setSelectedPortfolioId] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 포트폴리오 목록 조회
  useEffect(() => {
    clearError();
    void fetchPortfolios();

    return () => {
      clearError();
    };
  }, [clearError, fetchPortfolios]);

  // 주가 차트 생성
  useEffect(() => {
    if (!chartRef.current || !stock) {
      return;
    }

    const chartContainer = chartRef.current;

    const chart = createChart(chartContainer, {
      width: chartContainer.clientWidth,
      height: 300,
    });

    const lineSeries = chart.addSeries(LineSeries);

    lineSeries.setData(stock.chartData);

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainer.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [stock]);

  const handleAvgPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // 평균 매수가는 소수점 둘째 자리까지 허용
    if (!/^\d{0,13}(\.\d{0,2})?$/.test(value)) {
      return;
    }

    setAvgPrice(value);
    setSubmitError(null);
    clearError();
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // 보유 수량은 정수만 허용
    if (!/^\d*$/.test(value)) {
      return;
    }

    setQuantity(value);
    setSubmitError(null);
    clearError();
  };

  const handleAddStock = async () => {
    if (!stock) {
      setSubmitError("종목 정보를 찾을 수 없습니다.");
      return;
    }

    if (!selectedPortfolioId) {
      setSubmitError("종목을 추가할 포트폴리오를 선택해주세요.");
      return;
    }

    const parsedPortfolioId = Number(selectedPortfolioId);
    const parsedAvgPrice = Number(avgPrice);
    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedPortfolioId) || parsedPortfolioId <= 0) {
      setSubmitError("올바른 포트폴리오를 선택해주세요.");
      return;
    }

    if (!avgPrice || !Number.isFinite(parsedAvgPrice) || parsedAvgPrice <= 0) {
      setSubmitError("평균 매수가는 0보다 큰 숫자로 입력해주세요.");
      return;
    }

    if (!/^\d{1,13}(\.\d{1,2})?$/.test(avgPrice)) {
      setSubmitError(
        "평균 매수가는 소수점 둘째 자리까지만 입력할 수 있습니다.",
      );
      return;
    }

    if (!quantity || !Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setSubmitError("보유 수량은 1 이상의 정수로 입력해주세요.");
      return;
    }

    try {
      setSubmitError(null);
      clearError();

      await addStock(parsedPortfolioId, {
        ticker: stock.ticker,
        avgPrice: parsedAvgPrice,
        quantity: parsedQuantity,
      });

      window.alert("포트폴리오에 종목이 추가되었습니다.");

      navigate("/portfolio");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "포트폴리오에 종목을 추가하지 못했습니다.";

      setSubmitError(message);
    }
  };

  if (!stock) {
    return (
      <main
        style={{
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          padding: "80px 20px",
        }}
      >
        <p>종목 정보를 찾을 수 없습니다.</p>

        <button
          type="button"
          onClick={() => navigate("/stocks")}
          style={{
            marginTop: 20,
            padding: "10px 16px",
            border: "1px solid #d1d5db",
            borderRadius: 10,
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        >
          종목 목록으로 돌아가기
        </button>
      </main>
    );
  }

  const displayedError = submitError ?? storeError;

  return (
    <main
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        padding: "80px 20px",
      }}
    >
      <button
        type="button"
        onClick={() => navigate("/stocks")}
        style={{
          marginBottom: 24,
          padding: 0,
          border: "none",
          backgroundColor: "transparent",
          color: "#4b5563",
          cursor: "pointer",
        }}
      >
        ← 목록으로
      </button>

      <h1
        style={{
          marginBottom: 8,
          fontSize: 32,
          color: "#111827",
        }}
      >
        {stock.name}
      </h1>

      <p
        style={{
          marginBottom: 24,
          color: "#6b7280",
        }}
      >
        {stock.ticker}
      </p>

      <section
        style={{
          display: "grid",
          gap: 12,
          marginBottom: 32,
          padding: 24,
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          backgroundColor: "#fff",
        }}
      >
        <p style={{ margin: 0 }}>
          현재가: {Number(stock.price).toLocaleString()}
        </p>

        <p
          style={{
            margin: 0,
            color: stock.changeRate >= 0 ? "#dc2626" : "#2563eb",
          }}
        >
          등락률: {stock.changeRate >= 0 ? "+" : ""}
          {stock.changeRate}%
        </p>

        <p style={{ margin: 0 }}>섹터: {stock.sector}</p>

        <p style={{ margin: 0 }}>시가총액: {stock.marketCap}</p>

        <p
          style={{
            margin: 0,
            lineHeight: 1.7,
            color: "#4b5563",
          }}
        >
          {stock.description}
        </p>
      </section>

      <section
        style={{
          marginBottom: 32,
          padding: 24,
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          backgroundColor: "#fff",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: 8,
            fontSize: 22,
            color: "#111827",
          }}
        >
          포트폴리오에 담기
        </h2>

        <p
          style={{
            marginTop: 0,
            marginBottom: 24,
            color: "#6b7280",
            fontSize: 14,
          }}
        >
          추가할 포트폴리오와 평균 매수가, 보유 수량을 입력해주세요.
        </p>

        {isLoading && portfolios.length === 0 ? (
          <div
            style={{
              padding: 20,
              borderRadius: 12,
              backgroundColor: "#f9fafb",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            포트폴리오 목록을 불러오는 중입니다.
          </div>
        ) : portfolios.length === 0 ? (
          <div
            style={{
              padding: 20,
              borderRadius: 12,
              backgroundColor: "#f9fafb",
              textAlign: "center",
            }}
          >
            <p
              style={{
                marginTop: 0,
                marginBottom: 16,
                color: "#6b7280",
              }}
            >
              종목을 추가할 포트폴리오가 없습니다.
            </p>

            <Link
              to="/portfolio/new"
              style={{
                display: "inline-block",
                padding: "10px 16px",
                borderRadius: 10,
                backgroundColor: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              새 포트폴리오 만들기
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            <div>
              <label
                htmlFor="portfolio-select"
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "#374151",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                포트폴리오
              </label>

              <select
                id="portfolio-select"
                value={selectedPortfolioId}
                disabled={isLoading}
                onChange={(event) => {
                  setSelectedPortfolioId(event.target.value);
                  setSubmitError(null);
                  clearError();
                }}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: 10,
                  backgroundColor: isLoading ? "#f3f4f6" : "#fff",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                <option value="">포트폴리오를 선택해주세요.</option>

                {portfolios.map((portfolio) => (
                  <option
                    key={portfolio.portfolioId}
                    value={String(portfolio.portfolioId)}
                  >
                    {portfolio.name} · {portfolio.stockCount}개 종목
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              <div>
                <label
                  htmlFor="avg-price"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "#374151",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  평균 매수가
                </label>

                <div style={{ position: "relative" }}>
                  <input
                    id="avg-price"
                    type="text"
                    inputMode="decimal"
                    value={avgPrice}
                    disabled={isLoading}
                    onChange={handleAvgPriceChange}
                    placeholder="예: 70000.50"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "12px 42px 12px 14px",
                      border: "1px solid #d1d5db",
                      borderRadius: 10,
                      backgroundColor: isLoading ? "#f3f4f6" : "#fff",
                    }}
                  />

                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: 14,
                      transform: "translateY(-50%)",
                      color: "#9ca3af",
                      fontSize: 13,
                    }}
                  >
                    원
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "#374151",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  보유 수량
                </label>

                <div style={{ position: "relative" }}>
                  <input
                    id="quantity"
                    type="text"
                    inputMode="numeric"
                    value={quantity}
                    disabled={isLoading}
                    onChange={handleQuantityChange}
                    placeholder="예: 10"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "12px 42px 12px 14px",
                      border: "1px solid #d1d5db",
                      borderRadius: 10,
                      backgroundColor: isLoading ? "#f3f4f6" : "#fff",
                    }}
                  />

                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: 14,
                      transform: "translateY(-50%)",
                      color: "#9ca3af",
                      fontSize: 13,
                    }}
                  >
                    주
                  </span>
                </div>
              </div>
            </div>

            {Number(avgPrice) > 0 && Number(quantity) > 0 && (
              <div
                style={{
                  padding: 14,
                  borderRadius: 10,
                  backgroundColor: "#f9fafb",
                  textAlign: "right",
                  color: "#6b7280",
                  fontSize: 14,
                }}
              >
                총 매수 금액{" "}
                <strong
                  style={{
                    marginLeft: 6,
                    color: "#111827",
                    fontSize: 16,
                  }}
                >
                  {(Number(avgPrice) * Number(quantity)).toLocaleString()}원
                </strong>
              </div>
            )}

            {displayedError && (
              <p
                role="alert"
                style={{
                  margin: 0,
                  padding: "12px 14px",
                  border: "1px solid #fecaca",
                  borderRadius: 10,
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  fontSize: 14,
                }}
              >
                {displayedError}
              </p>
            )}

            <button
              type="button"
              disabled={isLoading}
              onClick={() => void handleAddStock()}
              style={{
                padding: "13px 20px",
                border: "none",
                borderRadius: 12,
                backgroundColor: isLoading ? "#a5b4fc" : "#4f46e5",
                color: "#fff",
                fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "추가 중..." : "포트폴리오에 담기"}
            </button>
          </div>
        )}
      </section>

      <section>
        <h2
          style={{
            marginBottom: 16,
            fontSize: 22,
            color: "#111827",
          }}
        >
          최근 30일 가격 차트
        </h2>

        <div
          ref={chartRef}
          style={{
            width: "100%",
            height: 300,
            boxSizing: "border-box",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 12,
            backgroundColor: "#fff",
          }}
        />
      </section>
    </main>
  );
}
