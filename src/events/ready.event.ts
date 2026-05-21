import type { Client } from "discord.js";

import type { AppContext } from "../core/app-context.js";

export function registerReadyEvent(client: Client, ctx: AppContext): void {
  client.once("clientReady", () => {
    ctx.logger.info({ user: client.user?.tag, guilds: client.guilds.cache.size }, "Bot is ready");
  });
}
