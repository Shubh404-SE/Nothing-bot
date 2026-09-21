import type { ChatInputCommandInteraction } from "discord.js";

import type { AppContext } from "../../../core/app-context.js";
import {
  errorEmbed,
  featureDisabledEmbed,
  translationResultEmbed,
} from "../../../discord/embeds.js";
import {
  editReplyWithUserFacingError,
  safeEditReply,
  safeReplyInteraction,
} from "../../../discord/replies.js";
import { runHandler } from "../../../shared/handler/run-handler.js";
import { UserFacingError } from "../../../shared/errors/user-facing.error.js";

function resolveSpeakerName(interaction: ChatInputCommandInteraction): string {
  if (interaction.inGuild() && interaction.member && "displayName" in interaction.member) {
    return interaction.member.displayName;
  }
  return interaction.user.globalName ?? interaction.user.username;
}

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
      const languageOption = interaction.options.getString("language", false);

      await interaction.deferReply({ ephemeral: true });

      const targetLang =
        languageOption ??
        (await ctx.preferenceService.resolveTargetLanguage(
          interaction.user.id,
          interaction.guildId,
        ));

      try {
        const result = await ctx.translationService.translateSlash({
          userId: interaction.user.id,
          guildId: interaction.guildId,
          interactionId: interaction.id,
          text,
          targetLang,
          applyCooldown: true,
          applyDedupe: true,
        });

        await safeEditReply(interaction, {
          embeds: [
            translationResultEmbed(result, {
              mode: "slash",
              speakerName: resolveSpeakerName(interaction),
            }),
          ],
        });
      } catch (error) {
        if (error instanceof UserFacingError) {
          await safeEditReply(interaction, {
            embeds: [errorEmbed(error.userMessage)],
          });
          return;
        }
        await editReplyWithUserFacingError(interaction, error);
      }
    },
  );
}
