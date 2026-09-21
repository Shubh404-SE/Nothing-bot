import type { StringSelectMenuInteraction } from "discord.js";

import type { AppContext } from "../../../core/app-context.js";
import {
  errorEmbed,
  featureDisabledEmbed,
  translationResultEmbed,
} from "../../../discord/embeds.js";
import { resolveMessageSpeakerName } from "../../../discord/message-speaker.js";
import { editReplyWithUserFacingError, safeEditReply } from "../../../discord/replies.js";
import { UserFacingError } from "../../../shared/errors/user-facing.error.js";
import { runHandler } from "../../../shared/handler/run-handler.js";
import { parseChangeLanguageCustomId } from "../translation-component.js";
import { buildChangeLanguageRow } from "../translation-select-menu.js";

export async function handleTranslateChangeLanguage(
  interaction: StringSelectMenuInteraction,
  ctx: AppContext,
): Promise<void> {
  await runHandler({ logger: ctx.logger, scope: "translate-change-language" }, async () => {
    const parsed = parseChangeLanguageCustomId(interaction.customId);
    if (!parsed) {
      return;
    }

    if (!ctx.featureFlags.isEnabled("translationContextMenu")) {
      await interaction.update({
        embeds: [featureDisabledEmbed("Translate Message")],
        components: [],
      });
      return;
    }

    const selectedLang = interaction.values[0];
    if (!selectedLang) {
      return;
    }

    if (selectedLang === parsed.currentLang) {
      await interaction.deferUpdate();
      return;
    }

    await interaction.deferUpdate();

    const channel =
      interaction.channel ??
      (await interaction.client.channels.fetch(interaction.channelId).catch(() => null));

    if (!channel?.isTextBased()) {
      await safeEditReply(interaction, {
        embeds: [errorEmbed("Original message is no longer available.")],
        components: [],
      });
      return;
    }

    const message = await channel.messages.fetch(parsed.messageId).catch(() => null);
    if (!message) {
      await safeEditReply(interaction, {
        embeds: [errorEmbed("Original message is no longer available.")],
        components: [],
      });
      return;
    }

    if (!message.content.trim()) {
      await safeEditReply(interaction, {
        embeds: [errorEmbed("This message has no text to translate.")],
        components: [],
      });
      return;
    }

    try {
      const result = await ctx.translationService.translateSlash({
        userId: interaction.user.id,
        guildId: interaction.guildId,
        interactionId: interaction.id,
        text: message.content,
        targetLang: selectedLang,
        applyCooldown: false,
        applyDedupe: false,
      });

      await safeEditReply(interaction, {
        embeds: [
          translationResultEmbed(result, {
            mode: "slash",
            speakerName: resolveMessageSpeakerName(message),
          }),
        ],
        components: [buildChangeLanguageRow(parsed.messageId, selectedLang)],
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
  });
}
