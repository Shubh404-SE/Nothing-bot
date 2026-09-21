import { SUPPORTED_SLASH_LANGUAGES } from "./language-map.js";

/**
 * Display flag for a target language. English uses 🌐 intentionally — not 🇺🇸.
 */
const LANGUAGE_TO_FLAG: Readonly<Record<string, string>> = {
  en: "🌐",
  hi: "🇮🇳",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  ja: "🇯🇵",
  ko: "🇰🇷",
  pt: "🇵🇹",
  ru: "🇷🇺",
  ar: "🇸🇦",
  zh: "🇨🇳",
  "zh-CN": "🇨🇳",
  "zh-TW": "🇹🇼",
  it: "🇮🇹",
  nl: "🇳🇱",
  tr: "🇹🇷",
  pl: "🇵🇱",
  vi: "🇻🇳",
  th: "🇹🇭",
  id: "🇮🇩",
  uk: "🇺🇦",
  bn: "🇧🇩",
  ur: "🇵🇰",
  sv: "🇸🇪",
  no: "🇳🇴",
  da: "🇩🇰",
  fi: "🇫🇮",
  el: "🇬🇷",
  ms: "🇲🇾",
  tl: "🇵🇭",
  he: "🇮🇱",
};

const LANGUAGE_COLORS: Readonly<Record<string, number>> = {
  hi: 0xff9933,
  en: 0x5865f2,
  es: 0xf1c40f,
  fr: 0x3498db,
  de: 0x2c3e50,
  ja: 0xe91e63,
  ko: 0x9b59b6,
  pt: 0x27ae60,
  ru: 0xc0392b,
  ar: 0x16a085,
  zh: 0xe74c3c,
  "zh-CN": 0xe74c3c,
  "zh-TW": 0x9b59b6,
};

export function getLanguageDisplayName(code: string): string {
  const normalized = code.trim().toLowerCase();
  if (normalized in SUPPORTED_SLASH_LANGUAGES) {
    return SUPPORTED_SLASH_LANGUAGES[normalized as keyof typeof SUPPORTED_SLASH_LANGUAGES];
  }
  if (normalized.startsWith("zh")) {
    return normalized === "zh-tw" ? "Chinese (Traditional)" : "Chinese (Simplified)";
  }
  return code.toUpperCase();
}

export function getLanguageFlagEmoji(code: string): string {
  const normalized = code.trim().toLowerCase();
  return LANGUAGE_TO_FLAG[normalized] ?? LANGUAGE_TO_FLAG[normalized.split("-")[0] ?? ""] ?? "🌐";
}

export function getLanguageEmbedColor(code: string): number {
  const normalized = code.trim().toLowerCase();
  return LANGUAGE_COLORS[normalized] ?? LANGUAGE_COLORS[normalized.split("-")[0] ?? ""] ?? 0x5865f2;
}

/** Slash command choices — English last; no 🇺🇸 default. */
export const SLASH_LANGUAGE_CHOICES = [
  { name: "🇮🇳 Hindi", value: "hi" },
  { name: "🇪🇸 Spanish", value: "es" },
  { name: "🇫🇷 French", value: "fr" },
  { name: "🇩🇪 German", value: "de" },
  { name: "🇯🇵 Japanese", value: "ja" },
  { name: "🇰🇷 Korean", value: "ko" },
  { name: "🇵🇹 Portuguese", value: "pt" },
  { name: "🇷🇺 Russian", value: "ru" },
  { name: "🇸🇦 Arabic", value: "ar" },
  { name: "🇨🇳 Chinese (Simplified)", value: "zh-CN" },
  { name: "🇹🇼 Chinese (Traditional)", value: "zh-TW" },
  { name: "🇮🇹 Italian", value: "it" },
  { name: "🇳🇱 Dutch", value: "nl" },
  { name: "🇹🇷 Turkish", value: "tr" },
  { name: "🇵🇱 Polish", value: "pl" },
  { name: "🇻🇳 Vietnamese", value: "vi" },
  { name: "🇹🇭 Thai", value: "th" },
  { name: "🇮🇩 Indonesian", value: "id" },
  { name: "🇺🇦 Ukrainian", value: "uk" },
  { name: "🇧🇩 Bengali", value: "bn" },
  { name: "🇵🇰 Urdu", value: "ur" },
  { name: "🌐 English", value: "en" },
] as const;
