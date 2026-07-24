// src/common/types/signal.ts

// 시그널 하나의 형태 (백엔드 응답 필드 그대로)
export interface Signal {
  id: number;
  stock_id: number;
  ticker: string;
  strategy_type: string;
  action: string;
  signal_value: number;
  close_price: number;
  signal_date: string;
  created_at: string;
}

// /api/signals 응답 전체 형태
export interface SignalListResponse {
  success: boolean;
  data: {
    signal_date: string;
    count: number;
    signals: Signal[];
  };
  message: string;
  code: string;
}
