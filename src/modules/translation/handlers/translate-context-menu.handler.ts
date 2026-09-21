import type { MessageContextMenuCommandInteraction } from "discord.js";

import type { AppContext } from "../../../core/app-context.js";
import {
  editReplyWithUserFacingError,
  safeEditReply,
  safeReplyInteraction,
} from "../../../discord/replies.js";
import {
  errorEmbed,
  featureDisabledEmbed,
  translationResultEmbed,
} from "../../../discord/embeds.js";
import { resolveMessageSpeakerName } from "../../../discord/message-speaker.js";
import { UserFacingError } from "../../../shared/errors/user-facing.error.js";
import { runHandler } from "../../../shared/handler/run-handler.js";
import { buildChangeLanguageRow } from "../translation-select-menu.js";

export async function handleTranslateMessageContextMenu(
  interaction: MessageContextMenuCommandInteraction,
  ctx: AppContext,
): Promise<void> {
  await runHandler(
    { logger: ctx.logger, scope: "translate-context-menu", meta: { command: "Translate Message" } },
    async () => {
      if (!ctx.featureFlags.isEnabled("translationContextMenu")) {
        await safeReplyInteraction(interaction, {
          embeds: [featureDisabledEmbed("Translate Message")],
          ephemeral: true,
        });
        return;
      }

      const targetMessage = interaction.targetMessage;
      if (!targetMessage.content.trim()) {
        await safeReplyInteraction(interaction, {
          embeds: [errorEmbed("This message has no text to translate.")],
          ephemeral: true,
        });
        return;
      }

      await interaction.deferReply({ ephemeral: true });

      const targetLang = await ctx.preferenceService.resolveTargetLanguage(
        interaction.user.id,
        interaction.guildId,
      );

      try {
        const result = await ctx.translationService.translateSlash({
          userId: interaction.user.id,
          guildId: interaction.guildId,
          interactionId: interaction.id,
          text: targetMessage.content,
          targetLang,
          applyCooldown: false,
          applyDedupe: false,
        });

        await safeEditReply(interaction, {
          embeds: [
            translationResultEmbed(result, {
              mode: "slash",
              speakerName: resolveMessageSpeakerName(targetMessage),
            }),
          ],
          components: [buildChangeLanguageRow(targetMessage.id, targetLang)],
        });
      } catch (error) {
        if (error instanceof UserFacingError) {
          await safeEditReply(interaction, {
            embeds: [errorEmbed(error.userMessage)],
            components: [],
          });
          return;
        }
        await editReplyWithUserFacingError(interaction, error);
      }
    },
  );
}
