import { SlashCommandBuilder } from "discord.js";

import type { SlashCommandDefinition } from "../../../commands/types.js";
import { SLASH_LANGUAGE_CHOICES } from "../language-display.js";
import { handleTranslateSlash } from "../handlers/translate-slash.handler.js";

const builder = new SlashCommandBuilder()
  .setName("translate")
  .setDescription("Translate text into another language")
  .addStringOption((option) => {
    let opt = option
      .setName("language")
      .setDescription("Choose the target language")
      .setRequired(true);
    for (const choice of SLASH_LANGUAGE_CHOICES) {
      opt = opt.addChoices({ name: choice.name, value: choice.value });
    }
    return opt;
  })
  .addStringOption((option) =>
    option.setName("text").setDescription("Text to translate").setRequired(true).setMaxLength(2000),
  );

export const translateCommand: SlashCommandDefinition = {
  name: "translate",
  builder,
  handler: handleTranslateSlash,
  toJSON: () => builder.toJSON(),
};
