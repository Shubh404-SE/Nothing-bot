import { EmbedBuilder } from "discord.js";

import { getLanguageDisplayName } from "../modules/translation/language-display.js";
import type { TranslationResponse } from "../types/translation.types.js";

/** Left accent bar — similar to compact translation bots */
const COMPACT_ACCENT_COLOR = 0x57f287;

export type TranslationEmbedContext = {
  mode: "slash" | "reaction";
  /** Display name on the source line, e.g. message author or command user */
  speakerName: string;
};

/**
 * Compact single embed: two lines (source + translation), colored left bar.
 * Example:
 *   Doctor(English): how can we talk??
 *   Hindi: हम कैसे बात कर सकते हैं?
 */
export function translationResultEmbed(
  result: TranslationResponse,
  context: TranslationEmbedContext,
): EmbedBuilder {
  const sourceLabel = result.detectedSourceLang
    ? getLanguageDisplayName(result.detectedSourceLang)
    : "Unknown";
  const targetLabel = getLanguageDisplayName(result.targetLang);

  const speaker = sanitizeSpeakerName(context.speakerName);
  const original = truncateLine(result.originalText, 900);
  const translated = truncateLine(result.translatedText, 1500);

  const lines = [`${speaker}(${sourceLabel}): ${original}`, `${targetLabel}: ${translated}`];

  if (result.truncated) {
    lines.push("_Text shortened to fit Discord limits._");
  }

  return new EmbedBuilder().setColor(COMPACT_ACCENT_COLOR).setDescription(lines.join("\n"));
}

export function errorEmbed(message: string): EmbedBuilder {
  return new EmbedBuilder().setColor(0xed4245).setDescription(`⚠️ ${message}`);
}

export function featureDisabledEmbed(featureName: string): EmbedBuilder {
  return errorEmbed(`${featureName} is currently disabled.`);
}

function sanitizeSpeakerName(name: string): string {
  const trimmed = name.trim().slice(0, 32);
  return trimmed || "User";
}

function truncateLine(text: string, max: number): string {
  const singleLine = text.trim().replace(/\n+/g, " ");
  if (singleLine.length <= max) {
    return singleLine || "—";
  }
  return `${singleLine.slice(0, max - 1)}…`;
}
