import type { Client } from "discord.js";

import { registerEvents } from "../events/index.js";
import type { AppContext } from "./app-context.js";
import { registerShutdownHandlers } from "./shutdown.js";

export async function bootstrap(client: Client, ctx: AppContext): Promise<void> {
  registerEvents(client, ctx);
  registerShutdownHandlers(client, ctx.logger);

  await client.login(ctx.config.env.DISCORD_TOKEN);
}
