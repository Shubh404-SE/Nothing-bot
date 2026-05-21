import { SlashCommandBuilder } from "discord.js";

import type { SlashCommandDefinition } from "../../../commands/types.js";
import { handleTranslateSlash } from "../handlers/translate-slash.handler.js";

const builder = new SlashCommandBuilder()
  .setName("translate")
  .setDescription("Translate text into another language")
  .addStringOption((option) =>
    option
      .setName("language")
      .setDescription("Target language code (e.g. hi, en, es)")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option.setName("text").setDescription("Text to translate").setRequired(true).setMaxLength(2000),
  );

export const translateCommand: SlashCommandDefinition = {
  name: "translate",
  builder,
  handler: handleTranslateSlash,
  toJSON: () => builder.toJSON(),
};
