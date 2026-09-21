import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";

import { buildChangeLanguageCustomId } from "./translation-component.js";
import { SLASH_LANGUAGE_CHOICES } from "./language-display.js";

export function buildChangeLanguageRow(
  messageId: string,
  currentLang: string,
): ActionRowBuilder<StringSelectMenuBuilder> {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(buildChangeLanguageCustomId(messageId, currentLang))
    .setPlaceholder("Change language")
    .addOptions(
      SLASH_LANGUAGE_CHOICES.map((choice) => ({
        label: choice.name,
        value: choice.value,
        default: choice.value === currentLang,
      })),
    );

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
}
