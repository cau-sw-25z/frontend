// src/common/types/signal.ts

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

// 인터셉터가 껍데기를 벗긴 후 실제로 받게 되는 알맹이
export interface SignalListData {
  signal_date: string;
  count: number;
  signals: Signal[];
}

// (참고용) 서버 원본 응답 전체 구조
export interface SignalListResponse {
  success: boolean;
  data: SignalListData;
  message: string;
  code: string;
}
