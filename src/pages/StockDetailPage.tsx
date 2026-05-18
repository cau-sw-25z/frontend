import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createChart, LineSeries } from "lightweight-charts";
import { mockStocks } from "../mocks/stocks";
import { usePortfolioStore } from "../store/usePortfolioStore";

export default function StockDetailPage() {
  const navigate = useNavigate();
  const { ticker } = useParams();
  const chartRef = useRef<HTMLDivElement | null>(null);

  const stock = mockStocks.find((item) => item.ticker === ticker);

  const addStock = usePortfolioStore((state) => state.addStock);

  useEffect(() => {
    if (!chartRef.current || !stock) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 300,
    });

    const lineSeries = chart.addSeries(LineSeries);
    lineSeries.setData(stock.chartData);

    return () => chart.remove();
  }, [stock]);

  if (!stock) {
    return <main style={{ padding: 80 }}>종목 정보를 찾을 수 없습니다.</main>;
  }

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
        style={{ marginBottom: 24 }}
      >
        ← 목록으로
      </button>

      <h1 style={{ fontSize: 32, marginBottom: 8 }}>{stock.name}</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>{stock.ticker}</p>

      <section style={{ display: "grid", gap: 12, marginBottom: 32 }}>
        <p>현재가: ${stock.price}</p>
        <p style={{ color: stock.changeRate >= 0 ? "red" : "blue" }}>
          등락률: {stock.changeRate >= 0 ? "+" : ""}
          {stock.changeRate}%
        </p>
        <p>섹터: {stock.sector}</p>
        <p>시가총액: {stock.marketCap}</p>
        <p>{stock.description}</p>
      </section>

      <button
        type="button"
        onClick={() => {
          addStock(stock);
          navigate("/portfolio");
        }}
        style={{
          padding: "12px 20px",
          borderRadius: 12,
          border: "none",
          background: "#4F46E5",
          color: "white",
          cursor: "pointer",
          marginBottom: 24,
        }}
      >
        포트폴리오에 담기
      </button>

      <section>
        <h2 style={{ fontSize: 22, marginBottom: 16 }}>최근 30일 가격 차트</h2>
        <div
          ref={chartRef}
          style={{
            width: "100%",
            height: 300,
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 12,
          }}
        />
      </section>
    </main>
  );
}
