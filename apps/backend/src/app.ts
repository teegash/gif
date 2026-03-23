import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config";
import { errorMiddleware } from "./middleware/error.middleware";
import assetRoutes from "./routes/assets.routes";
import authRoutes from "./routes/auth.routes";
import fxRoutes from "./routes/fx.routes";
import healthRoutes from "./routes/health.routes";
import journalRoutes from "./routes/journal.routes";
import watchlistRoutes from "./routes/watchlist.routes";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.frontendUrl,
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 200,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get("/", (_req, res) => {
    res.json({
      name: "Sentiment Watchlist API",
      status: "ok",
      mockMode: config.mockMode,
      mockMarketData: config.mockMarketData,
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/health", healthRoutes);
  app.use("/api/watchlist", watchlistRoutes);
  app.use("/api/assets", assetRoutes);
  app.use("/api/fx", fxRoutes);
  app.use("/api/journal", journalRoutes);

  app.use(errorMiddleware);
  return app;
}
