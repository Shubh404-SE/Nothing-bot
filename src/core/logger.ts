import pino from "pino";

import type { AppConfig } from "../config/index.js";

export function createLogger(config: AppConfig): pino.Logger {
  return pino({
    level: config.env.LOG_LEVEL,
    redact: {
      paths: ["DISCORD_TOKEN", "token", "authorization"],
      censor: "[REDACTED]",
    },
  });
}
