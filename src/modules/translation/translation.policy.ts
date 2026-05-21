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

export function simpleTextHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
