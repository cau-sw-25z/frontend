import { create } from "zustand";

type Stock = {
  ticker: string;
  name: string;
  price: number;
  changeRate: number;
};

interface PortfolioState {
  totalAsset: number;
  selectedStockIds: string[];
  portfolioStocks: Stock[];

  setTotalAsset: (totalAsset: number) => void;
  addSelectedStockId: (stockId: string) => void;
  removeSelectedStockId: (stockId: string) => void;
  clearSelectedStockIds: () => void;
  addStock: (stock: Stock) => void;
  removeStock: (ticker: string) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  totalAsset: 0,
  selectedStockIds: [],
  portfolioStocks: [],

  setTotalAsset: (totalAsset) => set({ totalAsset }),

  addSelectedStockId: (stockId) =>
    set((state) => ({
      selectedStockIds: [...state.selectedStockIds, stockId],
    })),

  removeSelectedStockId: (stockId) =>
    set((state) => ({
      selectedStockIds: state.selectedStockIds.filter((id) => id !== stockId),
    })),

  clearSelectedStockIds: () => set({ selectedStockIds: [] }),

  addStock: (stock) =>
    set((state) => {
      const alreadyExists = state.portfolioStocks.some(
        (item) => item.ticker === stock.ticker,
      );

      if (alreadyExists) return state;

      return {
        portfolioStocks: [...state.portfolioStocks, stock],
        selectedStockIds: [...state.selectedStockIds, stock.ticker],
      };
    }),

  removeStock: (ticker) =>
    set((state) => ({
      portfolioStocks: state.portfolioStocks.filter(
        (stock) => stock.ticker !== ticker,
      ),
      selectedStockIds: state.selectedStockIds.filter((id) => id !== ticker),
    })),
}));
