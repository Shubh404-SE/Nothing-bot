import "dotenv/config";

import { REST, Routes } from "discord.js";

import { createServices } from "../src/core/container.js";
import { registerAllCommands } from "../src/commands/index.js";
import { envSchema } from "../src/config/env.schema.js";

async function deploy(): Promise<void> {
  const env = envSchema.parse(process.env);
  const services = createServices();
  const registry = registerAllCommands(services);

  const body = registry.getAllDefinitions().map((cmd) => cmd.toJSON());
  const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

  if (env.DISCORD_GUILD_ID) {
    await rest.put(Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID), {
      body,
    });
    console.log(`Deployed ${body.length} guild command(s) to guild ${env.DISCORD_GUILD_ID}`);
  } else {
    await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body });
    console.log(`Deployed ${body.length} global command(s)`);
  }
}

deploy().catch((error) => {
  console.error("Command deploy failed", error);
  process.exit(1);
});
