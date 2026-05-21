import { EmbedBuilder } from "discord.js";

import type { TranslationResponse } from "../types/translation.types.js";

const BRAND_COLOR = 0x5865f2;

export function translationResultEmbed(result: TranslationResponse): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(BRAND_COLOR)
    .setTitle("Translation")
    .addFields(
      { name: "Original", value: truncateField(result.originalText) },
      { name: `Translated (${result.targetLang})`, value: truncateField(result.translatedText) },
    );

  if (result.detectedSourceLang) {
    embed.setFooter({ text: `Detected source: ${result.detectedSourceLang}` });
  }

  if (result.truncated) {
    embed.setDescription("_Output was truncated to fit Discord limits._");
  }

  return embed;
}

export function errorEmbed(message: string, title = "Translation error"): EmbedBuilder {
  return new EmbedBuilder().setColor(0xed4245).setTitle(title).setDescription(message);
}

export function featureDisabledEmbed(featureName: string): EmbedBuilder {
  return errorEmbed(`${featureName} is currently disabled.`, "Feature unavailable");
}

function truncateField(value: string, max = 1024): string {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max - 3)}...`;
}
