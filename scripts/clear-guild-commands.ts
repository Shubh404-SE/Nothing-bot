import "dotenv/config";

import { REST, Routes } from "discord.js";

import { envSchema } from "../src/config/env.schema.js";

async function clearGuildCommands(): Promise<void> {
  const env = envSchema.parse(process.env);
  if (!env.DISCORD_GUILD_ID) {
    throw new Error("Set DISCORD_GUILD_ID in .env to the guild you want to clear, then re-run.");
  }

  const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);
  await rest.put(Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID), {
    body: [],
  });
  console.log(`Cleared guild-scoped commands for guild ${env.DISCORD_GUILD_ID}`);
}

clearGuildCommands().catch((error) => {
  console.error("Failed to clear guild commands", error);
  process.exit(1);
});
