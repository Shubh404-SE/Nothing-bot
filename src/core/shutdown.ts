import type { Client } from "discord.js";
import type { Logger } from "pino";

export function registerShutdownHandlers(client: Client, logger: Logger): void {
  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, "Shutting down");
    try {
      client.destroy();
    } catch (error) {
      logger.error({ err: error }, "Error during client destroy");
    }
    process.exit(0);
  };

  process.once("SIGINT", () => {
    void shutdown("SIGINT");
  });
  process.once("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}
