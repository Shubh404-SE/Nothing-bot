export interface PreferenceRepository {
  getUserLanguage(userId: string): Promise<string | null>;
  setUserLanguage(userId: string, lang: string): Promise<void>;
  getGuildLanguage(guildId: string): Promise<string | null>;
  setGuildLanguage(guildId: string, lang: string): Promise<void>;
}
