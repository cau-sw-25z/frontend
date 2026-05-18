import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockStocks } from "../mocks/stocks";

export default function StocksPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState(""); // 여기 추가
  const [visibleCount, setVisibleCount] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const filteredStocks = mockStocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
      stock.ticker.toLowerCase().includes(debouncedSearchText.toLowerCase()),
  );

  const visibleStocks = filteredStocks.slice(0, visibleCount);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        !isLoading &&
        visibleCount < filteredStocks.length
      ) {
        setIsLoading(true);

        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + 2, filteredStocks.length));
          setIsLoading(false);
        }, 500);
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [filteredStocks.length, isLoading, visibleCount]);

  return (
    <main
      style={{
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
        padding: "80px 20px",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>종목 탐색</h1>

      <input
        type="text"
        placeholder="종목명 또는 티커를 검색하세요"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{
          width: "100%",
          padding: "14px 16px",
          border: "1px solid #ddd",
          borderRadius: 12,
          fontSize: 16,
          marginBottom: 24,
        }}
      />

      <div style={{ display: "grid", gap: 12 }}>
        {visibleStocks.map((stock) => (
          <button
            key={stock.ticker}
            type="button"
            onClick={() => navigate(`/stocks/${stock.ticker}`)}
            style={{
              padding: 20,
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              background: "white",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <strong>{stock.name}</strong>
            <p style={{ margin: "6px 0" }}>{stock.ticker}</p>
            <p style={{ margin: 0 }}>${stock.price}</p>
            <p
              style={{
                margin: "6px 0 0",
                color: stock.changeRate >= 0 ? "red" : "blue",
              }}
            >
              {stock.changeRate >= 0 ? "+" : ""}
              {stock.changeRate}%
            </p>
          </button>
        ))}
      </div>
      {isLoading && (
        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {[1, 2].map((item) => (
            <div
              key={item}
              style={{
                height: 120,
                borderRadius: 16,
                background: "#f3f4f6",
              }}
            />
          ))}
        </div>
      )}
      <div ref={observerRef} style={{ height: 20 }} />
    </main>
  );
}
