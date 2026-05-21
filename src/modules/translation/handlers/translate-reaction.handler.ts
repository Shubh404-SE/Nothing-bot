import type { MessageReaction, User } from "discord.js";

import type { AppContext } from "../../../core/app-context.js";
import { translationResultEmbed } from "../../../discord/embeds.js";
import { safeReplyMessage } from "../../../discord/replies.js";
import { resolveReactionFlag } from "../../../utils/emoji/resolve-reaction-flag.js";
import { getLanguageFlagEmoji } from "../language-display.js";
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

  const resolved = resolveReactionFlag(reaction.emoji);
  if (!resolved) {
    return;
  }

  const targetLang = resolveLanguageFromFlagCountry(resolved.countryCode);
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

  const reactionFlag =
    resolved.countryCode === "US" ? "🌐" : (reaction.emoji.name ?? getLanguageFlagEmoji(targetLang));

  await safeReplyMessage(message, {
    embeds: [
      translationResultEmbed(result, {
        mode: "reaction",
        actorTag: user.tag,
        sourceFlag: reactionFlag,
      }),
    ],
    allowedMentions: { repliedUser: false },
  });
}
