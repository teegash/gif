import winston from "winston";
import { config } from "../config";

const logger = winston.createLogger({
  level: config.nodeEnv === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    config.nodeEnv === "production"
      ? winston.format.json()
      : winston.format.printf(({ level, message, timestamp, stack }) =>
          `${timestamp} [${level}] ${stack || message}`
        )
  ),
  defaultMeta: { service: "sentiment-watchlist-api" },
  transports: [new winston.transports.Console()],
});

export default logger;

