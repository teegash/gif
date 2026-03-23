import { WatchlistAsset } from "@sentiment-watchlist/shared-types";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useDashboardData(): UseQueryResult<{ assets: WatchlistAsset[] }, Error> {
  return useQuery<{ assets: WatchlistAsset[] }, Error>({
    queryKey: ["watchlist"],
    queryFn: (): Promise<{ assets: WatchlistAsset[] }> => api.getWatchlist(),
  });
}
