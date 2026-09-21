import { createHash } from "node:crypto";

export function shouldIgnoreMessageForTranslation(params: {
  content: string;
  authorIsBot: boolean;
}): boolean {
  if (params.authorIsBot) {
    return true;
  }
  if (!params.content.trim()) {
    return true;
  }
  return false;
}

export function buildReactionCooldownKey(guildId: string, userId: string): string {
  return `${guildId}:${userId}:react-translate`;
}

export function buildReactionDedupeKey(
  guildId: string,
  channelId: string,
  messageId: string,
  targetLang: string,
): string {
  return `${guildId}:${channelId}:${messageId}:${targetLang}`;
}

export function buildSlashDedupeKey(userId: string, textHash: string, targetLang: string): string {
  return `${userId}:${textHash}:${targetLang}`;
}

export function buildSlashCooldownKey(userId: string, guildId: string | null): string {
  return `${guildId ?? "dm"}:${userId}:slash-translate`;
}

export function simpleTextHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Cryptographic hash used only for the translation-result cache key, where a
 * collision would silently serve a different message's translation. The
 * non-crypto `simpleTextHash` above stays fine for dedupe locks, where a
 * false collision just means "treated as a duplicate, retry".
 */
export function sha1TextHash(text: string): string {
  return createHash("sha1").update(text, "utf8").digest("hex");
}
