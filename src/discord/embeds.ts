import { EmbedBuilder } from "discord.js";

import {
  getLanguageDisplayName,
  getLanguageEmbedColor,
  getLanguageFlagEmoji,
} from "../modules/translation/language-display.js";
import type { TranslationResponse } from "../types/translation.types.js";

export type TranslationEmbedContext = {
  mode: "slash" | "reaction";
  actorTag?: string;
  sourceFlag?: string;
};

export function translationResultEmbed(
  result: TranslationResponse,
  context: TranslationEmbedContext,
): EmbedBuilder {
  const targetFlag = getLanguageFlagEmoji(result.targetLang);
  const targetName = getLanguageDisplayName(result.targetLang);
  const color = getLanguageEmbedColor(result.targetLang);

  const title =
    context.mode === "reaction" && context.sourceFlag
      ? `${context.sourceFlag} → ${targetFlag} ${targetName}`
      : `${targetFlag} ${targetName}`;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(formatTranslationBlock(result.translatedText))
    .addFields({
      name: "Original",
      value: formatQuoteBlock(result.originalText),
      inline: false,
    });

  const footerParts: string[] = [];
  if (result.detectedSourceLang) {
    const sourceFlag = getLanguageFlagEmoji(result.detectedSourceLang);
    const sourceName = getLanguageDisplayName(result.detectedSourceLang);
    footerParts.push(`Detected: ${sourceFlag} ${sourceName}`);
  }
  if (context.mode === "reaction") {
    footerParts.push("React with a country flag to translate");
  } else {
    footerParts.push("Nothing Bot · /translate");
  }
  if (context.actorTag) {
    footerParts.push(`Requested by ${context.actorTag}`);
  }

  embed.setFooter({ text: footerParts.join(" · ") });

  if (result.truncated) {
    embed.addFields({
      name: "Note",
      value: "Translation was shortened to fit Discord limits.",
      inline: false,
    });
  }

  return embed;
}

export function errorEmbed(message: string, title = "Translation unavailable"): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0xed4245)
    .setTitle(`⚠️ ${title}`)
    .setDescription(message);
}

export function featureDisabledEmbed(featureName: string): EmbedBuilder {
  return errorEmbed(`${featureName} is currently disabled.`, "Feature unavailable");
}

function formatQuoteBlock(text: string): string {
  const trimmed = truncateField(text.trim(), 1000);
  if (!trimmed) {
    return "_Empty_";
  }
  return trimmed
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}

function formatTranslationBlock(text: string): string {
  const trimmed = truncateField(text.trim(), 3800);
  return `**${trimmed}**`;
}

function truncateField(value: string, max: number): string {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max - 3)}...`;
}
