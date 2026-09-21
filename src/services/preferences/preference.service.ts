import type { PreferenceRepository } from "../../database/repositories/preference.repository.js";
import {
  isSupportedSlashLanguage,
  normalizeSlashLanguageCode,
} from "../../modules/translation/language-map.js";

const DEFAULT_FALLBACK_LANGUAGE = "en";

export class PreferenceService {
  constructor(private readonly repository: PreferenceRepository) {}

  getUserLanguage(userId: string): Promise<string | null> {
    return this.repository.getUserLanguage(userId);
  }

  async setUserLanguage(userId: string, lang: string): Promise<void> {
    await this.repository.setUserLanguage(userId, normalizeSlashLanguageCode(lang));
  }

  getGuildLanguage(guildId: string): Promise<string | null> {
    return this.repository.getGuildLanguage(guildId);
  }

  async setGuildLanguage(guildId: string, lang: string): Promise<void> {
    await this.repository.setGuildLanguage(guildId, normalizeSlashLanguageCode(lang));
  }

  async resolveTargetLanguage(userId: string, guildId: string | null): Promise<string> {
    const userLang = await this.repository.getUserLanguage(userId);
    if (userLang && isSupportedSlashLanguage(userLang)) {
      return normalizeSlashLanguageCode(userLang);
    }

    if (guildId) {
      const guildLang = await this.repository.getGuildLanguage(guildId);
      if (guildLang && isSupportedSlashLanguage(guildLang)) {
        return normalizeSlashLanguageCode(guildLang);
      }
    }

    return DEFAULT_FALLBACK_LANGUAGE;
  }
}
