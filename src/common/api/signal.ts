// src/common/api/signal.ts
import axiosInstance from "./axiosInstance";
import type { SignalListData } from "@/common/types/signal";

// 최신 전체 시그널 조회 (GET /api/signals)
export const getSignals = async (): Promise<SignalListData> => {
  return await axiosInstance.get("/api/signals");
};

// 특정 종목 시그널 히스토리 조회 (GET /api/stocks/{ticker}/signals)
export const getStockSignals = async (
  ticker: string,
): Promise<SignalListData> => {
  return await axiosInstance.get(`/api/stocks/${ticker}/signals`);
};
