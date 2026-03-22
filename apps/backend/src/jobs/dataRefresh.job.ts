import cron from "node-cron";
import logger from "../lib/logger";
import { warmAssetCaches } from "../services/watchlist.service";

let isRunning = false;

async function refreshAllWatchlistData() {
  if (isRunning) {
    logger.warn("[Cron] Previous refresh still running, skipping cycle");
    return;
  }

  isRunning = true;
  try {
    await warmAssetCaches();
    logger.info("[Cron] Watchlist caches refreshed");
  } catch (error) {
    logger.error(`[Cron] Refresh failed: ${(error as Error).message}`);
  } finally {
    isRunning = false;
  }
}

export function startDataRefreshJobs() {
  cron.schedule("* * * * *", () => {
    refreshAllWatchlistData().catch((error) =>
      logger.error(`[Cron] Minute refresh failed: ${(error as Error).message}`)
    );
  });

  cron.schedule("*/15 * * * *", () => {
    refreshAllWatchlistData().catch((error) =>
      logger.error(`[Cron] Fifteen-minute refresh failed: ${(error as Error).message}`)
    );
  });

  logger.info("[Cron] Scheduled refresh jobs started");
}

