import { createApp } from "./app";
import { config } from "./config";
import { startDataRefreshJobs } from "./jobs/dataRefresh.job";
import logger from "./lib/logger";

const app = createApp();

app.listen(config.port, () => {
  logger.info(`API server listening on http://localhost:${config.port}`);
  startDataRefreshJobs();
});

