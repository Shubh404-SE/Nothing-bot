export type TranslateParams = {
  text: string;
  targetLang: string;
  sourceLang?: string;
};

export type TranslateResult = {
  translatedText: string;
  detectedSourceLang?: string;
};

export interface TranslationProvider {
  translate(params: TranslateParams): Promise<TranslateResult>;
}
