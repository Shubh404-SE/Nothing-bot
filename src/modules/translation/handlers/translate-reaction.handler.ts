import type { MessageReaction, User } from "discord.js";

import type { AppContext } from "../../../core/app-context.js";
import { translationResultEmbed } from "../../../discord/embeds.js";
import { safeReplyMessage } from "../../../discord/replies.js";
import { parseFlagEmoji } from "../../../utils/emoji/parse-flag-emoji.js";
import { resolveLanguageFromFlagCountry } from "../language-map.js";
import { shouldIgnoreMessageForTranslation } from "../translation.policy.js";

export async function handleTranslateReaction(
  reaction: MessageReaction,
  user: User,
  ctx: AppContext,
): Promise<void> {
  if (!ctx.featureFlags.isEnabled("translationReaction")) {
    return;
  }

  if (user.bot) {
    return;
  }

  const emoji = reaction.emoji.name;
  if (!emoji) {
    return;
  }

  const countryCode = parseFlagEmoji(emoji);
  if (!countryCode) {
    return;
  }

  const targetLang = resolveLanguageFromFlagCountry(countryCode);
  if (!targetLang) {
    return;
  }

  const message = reaction.message.partial
    ? await reaction.message.fetch().catch(() => null)
    : reaction.message;

  if (!message) {
    return;
  }

  const guildId = message.guildId;
  const channelId = message.channelId;
  if (!guildId || !channelId) {
    return;
  }

  if (
    shouldIgnoreMessageForTranslation({
      content: message.content,
      authorIsBot: message.author.bot,
    })
  ) {
    return;
  }

  const result = await ctx.translationService.translateReaction({
    guildId,
    channelId,
    messageId: message.id,
    userId: user.id,
    targetLang,
    text: message.content,
  });

  if (!result) {
    return;
  }

  await safeReplyMessage(message, {
    embeds: [translationResultEmbed(result)],
    allowedMentions: { repliedUser: false },
  });
}
