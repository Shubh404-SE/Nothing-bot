import type { Client } from "discord.js";

import type { AppContext } from "../core/app-context.js";

export function registerInteractionCreateEvent(client: Client, ctx: AppContext): void {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const handled = await ctx.commandRegistry.dispatch(interaction, ctx);
    if (!handled) {
      ctx.logger.warn({ command: interaction.commandName }, "Unhandled slash command");
    }
  });
}
