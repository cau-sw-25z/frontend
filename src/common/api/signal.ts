// src/common/api/signal.ts
import axiosInstance from "./axiosInstance";
import type { SignalListResponse } from "@/common/types/signal";

// 최신 전체 시그널 조회 (GET /api/signals)
export const getSignals = async () => {
  const res = await axiosInstance.get<SignalListResponse>("/api/signals");
  return res.data.data;
};

// 특정 종목 시그널 히스토리 조회 (GET /api/stocks/{ticker}/signals)
export const getStockSignals = async (ticker: string) => {
  const res = await axiosInstance.get<SignalListResponse>(
    `/api/stocks/${ticker}/signals`,
  );
  return res.data.data;
};
