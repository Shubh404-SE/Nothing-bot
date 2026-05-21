export type TranslationRequest = {
  text: string;
  targetLang: string;
  sourceLang?: string;
};

export type TranslationResponse = {
  originalText: string;
  translatedText: string;
  targetLang: string;
  detectedSourceLang?: string;
  truncated: boolean;
};

export type ReactionTranslationContext = {
  guildId: string;
  channelId: string;
  messageId: string;
  userId: string;
  targetLang: string;
  text: string;
};

export type SlashTranslationContext = {
  userId: string;
  interactionId: string;
  text: string;
  targetLang: string;
};
