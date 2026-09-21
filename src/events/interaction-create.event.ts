import type { Client } from "discord.js";

import type { AppContext } from "../core/app-context.js";
import {
  handleTranslateChangeLanguage,
  isChangeLanguageCustomId,
} from "../modules/translation/index.js";

export function registerInteractionCreateEvent(client: Client, ctx: AppContext): void {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
      const handled = await ctx.commandRegistry.dispatchChatInput(interaction, ctx);
      if (!handled) {
        ctx.logger.warn({ command: interaction.commandName }, "Unhandled slash command");
      }
      return;
    }

    if (interaction.isMessageContextMenuCommand()) {
      const handled = await ctx.commandRegistry.dispatchMessageContextMenu(interaction, ctx);
      if (!handled) {
        ctx.logger.warn({ command: interaction.commandName }, "Unhandled context menu command");
      }
      return;
    }

    if (interaction.isStringSelectMenu() && isChangeLanguageCustomId(interaction.customId)) {
      await handleTranslateChangeLanguage(interaction, ctx);
    }
  });
}
