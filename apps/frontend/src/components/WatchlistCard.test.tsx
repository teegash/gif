import { render, screen } from "@testing-library/react";
import WatchlistCard from "./WatchlistCard";

describe("WatchlistCard", () => {
  it("renders key asset data", () => {
    render(
      <WatchlistCard
        asset={{
          id: "btc",
          symbol: "BTC",
          assetType: "CRYPTO",
          displayName: "Bitcoin",
          priceData: {
            symbol: "BTC",
            assetType: "CRYPTO",
            price: 64000,
            priceChange24h: 1000,
            priceChangePercent24h: 1.5,
            volume24h: 1,
            marketCap: 1,
            currency: "USD",
            capturedAt: new Date().toISOString(),
          },
          sentimentSnapshot: {
            symbol: "BTC",
            windowHours: 24,
            avgScore: 0.4,
            dominantLabel: "positive",
            positiveCount: 10,
            negativeCount: 2,
            neutralCount: 1,
            articleCount: 13,
            capturedAt: new Date().toISOString(),
          },
          divergenceAlert: null,
          recentNews: [],
        }}
        onClick={() => undefined}
      />
    );

    expect(screen.getByText("BTC")).toBeInTheDocument();
    expect(screen.getByText(/Bitcoin/)).toBeInTheDocument();
    expect(screen.getByText(/positive/)).toBeInTheDocument();
  });
});
