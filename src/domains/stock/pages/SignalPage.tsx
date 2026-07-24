// src/domains/stock/pages/SignalPage.tsx
import { useEffect, useState } from "react";
import { getSignals } from "@/common/api/signal";
import type { Signal } from "@/common/types/signal";

export default function SignalPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [signalDate, setSignalDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSignals()
      .then((data) => {
        setSignals(data.signals);
        setSignalDate(data.signal_date);
      })
      .catch(() => setError("시그널을 불러오지 못했습니다."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main
      style={{
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
        padding: "80px 20px",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>매매 시그널</h1>
      {signalDate && (
        <p style={{ margin: "0 0 24px", color: "#6b7280" }}>
          {signalDate} 기준 · 총 {signals.length}건
        </p>
      )}

      {isLoading && <p>불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!isLoading && !error && signals.length === 0 && (
        <p>표시할 시그널이 없습니다.</p>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {signals.map((signal) => {
          const isBuy = signal.signal_value >= 0;
          return (
            <div
              key={signal.id}
              style={{
                padding: 20,
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                background: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong>{signal.ticker}</strong>
                <span
                  style={{
                    color: isBuy ? "red" : "blue",
                    fontWeight: 600,
                  }}
                >
                  {signal.action}
                </span>
              </div>
              <p style={{ margin: "10px 0 0" }}>
                종가 {signal.close_price.toLocaleString()}원
              </p>
              <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
                {signal.strategy_type} · 시그널 값 {signal.signal_value}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
