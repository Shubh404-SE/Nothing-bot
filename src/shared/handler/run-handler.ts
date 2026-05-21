import type { Logger } from "pino";

import { UserFacingError } from "../errors/user-facing.error.js";

export type HandlerContext = {
  logger: Logger;
  scope: string;
  meta?: Record<string, unknown>;
};

export async function runHandler(ctx: HandlerContext, fn: () => Promise<void>): Promise<void> {
  const start = Date.now();
  try {
    await fn();
  } catch (error) {
    if (error instanceof UserFacingError) {
      ctx.logger.warn({ err: error, ...ctx.meta, scope: ctx.scope }, error.userMessage);
      throw error;
    }
    ctx.logger.error(
      { err: error, ...ctx.meta, scope: ctx.scope, durationMs: Date.now() - start },
      "Unhandled handler error",
    );
    throw error;
  }
}
