import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChartWindow, WatchlistAsset } from "@sentiment-watchlist/shared-types";

interface WatchlistStore {
  assets: WatchlistAsset[];
  selectedSymbol: string | null;
  chartWindow: ChartWindow;
  setAssets: (assets: WatchlistAsset[]) => void;
  setSelectedSymbol: (symbol: string | null) => void;
  setChartWindow: (window: ChartWindow) => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set) => ({
      assets: [],
      selectedSymbol: null,
      chartWindow: "24h",
      setAssets: (assets) => set({ assets }),
      setSelectedSymbol: (selectedSymbol) => set({ selectedSymbol }),
      setChartWindow: (chartWindow) => set({ chartWindow }),
    }),
    { name: "watchlist-store" }
  )
);

