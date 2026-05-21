/**
 * Maps ISO 3166-1 alpha-2 country codes (from flag emojis) to BCP-47 language codes.
 * Explicit table — do not guess locale from country alone beyond this map.
 */
export const FLAG_COUNTRY_TO_LANGUAGE: Readonly<Record<string, string>> = {
  IN: "hi",
  US: "en",
  GB: "en",
  FR: "fr",
  DE: "de",
  ES: "es",
  IT: "it",
  JP: "ja",
  KR: "ko",
  CN: "zh-CN",
  TW: "zh-TW",
  BR: "pt",
  PT: "pt",
  RU: "ru",
  SA: "ar",
  AE: "ar",
  TR: "tr",
  NL: "nl",
  PL: "pl",
  SE: "sv",
  NO: "no",
  DK: "da",
  FI: "fi",
  GR: "el",
  TH: "th",
  VN: "vi",
  ID: "id",
  MY: "ms",
  PH: "tl",
  UA: "uk",
  IL: "he",
  BD: "bn",
  PK: "ur",
};

export const SUPPORTED_SLASH_LANGUAGES: Readonly<Record<string, string>> = {
  en: "English",
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  de: "German",
  ja: "Japanese",
  ko: "Korean",
  pt: "Portuguese",
  ru: "Russian",
  ar: "Arabic",
  zh: "Chinese",
  it: "Italian",
  nl: "Dutch",
  tr: "Turkish",
  pl: "Polish",
  vi: "Vietnamese",
  th: "Thai",
  id: "Indonesian",
  uk: "Ukrainian",
  bn: "Bengali",
  ur: "Urdu",
};

export function resolveLanguageFromFlagCountry(countryCode: string): string | null {
  return FLAG_COUNTRY_TO_LANGUAGE[countryCode.toUpperCase()] ?? null;
}

export function normalizeSlashLanguageCode(code: string): string {
  return code.trim().toLowerCase();
}

export function isSupportedSlashLanguage(code: string): boolean {
  const normalized = normalizeSlashLanguageCode(code);
  return normalized in SUPPORTED_SLASH_LANGUAGES || normalized.startsWith("zh");
}
