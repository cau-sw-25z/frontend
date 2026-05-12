import { create } from 'zustand';

interface PortfolioState {
  totalAsset: number;
  selectedStockIds: string[];

  setTotalAsset: (totalAsset: number) => void;

  addSelectedStockId: (stockId: string) => void;

  removeSelectedStockId: (stockId: string) => void;

  clearSelectedStockIds: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  totalAsset: 0,

  selectedStockIds: [],

  setTotalAsset: (totalAsset) =>
    set({
      totalAsset,
    }),

  addSelectedStockId: (stockId) =>
    set((state) => ({
      selectedStockIds: [
        ...state.selectedStockIds,
        stockId,
      ],
    })),

  removeSelectedStockId: (stockId) =>
    set((state) => ({
      selectedStockIds:
        state.selectedStockIds.filter(
          (id) => id !== stockId,
        ),
    })),

  clearSelectedStockIds: () =>
    set({
      selectedStockIds: [],
    }),
}));