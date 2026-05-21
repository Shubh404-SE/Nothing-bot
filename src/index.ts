import { registerAllCommands } from "./commands/index.js";
import { createDiscordClient } from "./core/client.js";
import { bootstrap } from "./core/bootstrap.js";
import { createServices } from "./core/container.js";
import type { AppContext } from "./core/app-context.js";

async function main(): Promise<void> {
  const services = createServices();
  const commandRegistry = registerAllCommands(services);
  const ctx: AppContext = { ...services, commandRegistry };
  const client = createDiscordClient();

  ctx.logger.info("Starting Nothing Bot");
  await bootstrap(client, ctx);
}

main().catch((error) => {
  console.error("Fatal startup error", error);
  process.exit(1);
});
