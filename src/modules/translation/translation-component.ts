const CHANGE_LANGUAGE_PREFIX = "translate:change-lang:";

export function buildChangeLanguageCustomId(messageId: string, currentLang: string): string {
  return `${CHANGE_LANGUAGE_PREFIX}${messageId}:${currentLang}`;
}

export function isChangeLanguageCustomId(customId: string): boolean {
  return customId.startsWith(CHANGE_LANGUAGE_PREFIX);
}

export function parseChangeLanguageCustomId(
  customId: string,
): { messageId: string; currentLang: string } | null {
  if (!isChangeLanguageCustomId(customId)) {
    return null;
  }
  const remainder = customId.slice(CHANGE_LANGUAGE_PREFIX.length);
  const separatorIndex = remainder.lastIndexOf(":");
  if (separatorIndex <= 0 || separatorIndex === remainder.length - 1) {
    return null;
  }
  const messageId = remainder.slice(0, separatorIndex);
  const currentLang = remainder.slice(separatorIndex + 1);
  return { messageId, currentLang };
}
