import type { ChatInputCommandInteraction } from "discord.js";

import type { AppContext } from "../../../core/app-context.js";
import { errorEmbed, featureDisabledEmbed, infoEmbed } from "../../../discord/embeds.js";
import { replyWithUserFacingError, safeReplyInteraction } from "../../../discord/replies.js";
import { runHandler } from "../../../shared/handler/run-handler.js";
import { getLanguageDisplayName } from "../language-display.js";

export async function handleServerLanguageCommand(
  interaction: ChatInputCommandInteraction,
  ctx: AppContext,
): Promise<void> {
  await runHandler(
    { logger: ctx.logger, scope: "server-language", meta: { command: "server-language" } },
    async () => {
      if (!ctx.featureFlags.isEnabled("translationSlash")) {
        await safeReplyInteraction(interaction, {
          embeds: [featureDisabledEmbed("Server language settings")],
          ephemeral: true,
        });
        return;
      }

      if (!interaction.guildId) {
        await safeReplyInteraction(interaction, {
          embeds: [errorEmbed("This command can only be used in a server.")],
          ephemeral: true,
        });
        return;
      }

      const language = interaction.options.getString("language", true);

      try {
        await ctx.preferenceService.setGuildLanguage(interaction.guildId, language);
        await safeReplyInteraction(interaction, {
          embeds: [
            infoEmbed(
              `This server's default translation language is now **${getLanguageDisplayName(language)}**.`,
            ),
          ],
          ephemeral: true,
        });
      } catch (error) {
        await replyWithUserFacingError(interaction, error);
      }
    },
  );
}
