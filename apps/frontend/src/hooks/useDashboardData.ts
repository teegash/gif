import { WatchlistAsset } from "@sentiment-watchlist/shared-types";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useDashboardData() {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: (): Promise<{ assets: WatchlistAsset[] }> => api.getWatchlist(),
  });
}
