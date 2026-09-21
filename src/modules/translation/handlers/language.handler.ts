import type { ChatInputCommandInteraction } from "discord.js";

import type { AppContext } from "../../../core/app-context.js";
import { featureDisabledEmbed, infoEmbed } from "../../../discord/embeds.js";
import { replyWithUserFacingError, safeReplyInteraction } from "../../../discord/replies.js";
import { runHandler } from "../../../shared/handler/run-handler.js";
import { getLanguageDisplayName } from "../language-display.js";

export async function handleLanguageCommand(
  interaction: ChatInputCommandInteraction,
  ctx: AppContext,
): Promise<void> {
  await runHandler(
    { logger: ctx.logger, scope: "language", meta: { command: "language" } },
    async () => {
      if (!ctx.featureFlags.isEnabled("translationSlash")) {
        await safeReplyInteraction(interaction, {
          embeds: [featureDisabledEmbed("Language preferences")],
          ephemeral: true,
        });
        return;
      }

      const subcommand = interaction.options.getSubcommand(true);

      try {
        if (subcommand === "set") {
          const language = interaction.options.getString("language", true);
          await ctx.preferenceService.setUserLanguage(interaction.user.id, language);
          await safeReplyInteraction(interaction, {
            embeds: [
              infoEmbed(
                `Your default translation language is now **${getLanguageDisplayName(language)}**.`,
              ),
            ],
            ephemeral: true,
          });
          return;
        }

        const rawUserLang = await ctx.preferenceService.getUserLanguage(interaction.user.id);
        const resolvedLang = await ctx.preferenceService.resolveTargetLanguage(
          interaction.user.id,
          interaction.guildId,
        );
        const description = rawUserLang
          ? `Your default translation language is **${getLanguageDisplayName(rawUserLang)}**.`
          : `You haven't set a personal default yet. Translations will currently use **${getLanguageDisplayName(resolvedLang)}**.`;

        await safeReplyInteraction(interaction, {
          embeds: [infoEmbed(description)],
          ephemeral: true,
        });
      } catch (error) {
        await replyWithUserFacingError(interaction, error);
      }
    },
  );
}
