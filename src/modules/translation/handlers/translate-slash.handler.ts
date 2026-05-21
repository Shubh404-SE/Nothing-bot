import type { ChatInputCommandInteraction } from "discord.js";

import type { AppContext } from "../../../core/app-context.js";
import {
  errorEmbed,
  featureDisabledEmbed,
  translationResultEmbed,
} from "../../../discord/embeds.js";
import { replyWithUserFacingError, safeReplyInteraction } from "../../../discord/replies.js";
import { runHandler } from "../../../shared/handler/run-handler.js";
import { UserFacingError } from "../../../shared/errors/user-facing.error.js";

export async function handleTranslateSlash(
  interaction: ChatInputCommandInteraction,
  ctx: AppContext,
): Promise<void> {
  await runHandler(
    { logger: ctx.logger, scope: "translate-slash", meta: { command: "translate" } },
    async () => {
      if (!ctx.featureFlags.isEnabled("translationSlash")) {
        await safeReplyInteraction(interaction, {
          embeds: [featureDisabledEmbed("Slash translation")],
          ephemeral: true,
        });
        return;
      }

      const text = interaction.options.getString("text", true);
      const language = interaction.options.getString("language", true);

      try {
        const result = await ctx.translationService.translateSlash({
          userId: interaction.user.id,
          interactionId: interaction.id,
          text,
          targetLang: language,
        });

        await safeReplyInteraction(interaction, {
          embeds: [translationResultEmbed(result)],
          ephemeral: true,
        });
      } catch (error) {
        if (error instanceof UserFacingError) {
          await safeReplyInteraction(interaction, {
            embeds: [errorEmbed(error.userMessage)],
            ephemeral: true,
          });
          return;
        }
        await replyWithUserFacingError(interaction, error);
      }
    },
  );
}
