import {
  ApplicationIntegrationType,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";

import type { SlashCommandDefinition } from "../../../commands/types.js";
import { SLASH_LANGUAGE_CHOICES } from "../language-display.js";
import { handleTranslateSlash } from "../handlers/translate-slash.handler.js";

const builder = new SlashCommandBuilder()
  .setName("translate")
  .setDescription("Translate text into another language")
  .setIntegrationTypes(
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel,
  )
  .addStringOption((option) =>
    option.setName("text").setDescription("Text to translate").setRequired(true).setMaxLength(2000),
  )
  .addStringOption((option) => {
    let opt = option
      .setName("language")
      .setDescription("Target language (defaults to your saved preference, or English)")
      .setRequired(false);
    for (const choice of SLASH_LANGUAGE_CHOICES) {
      opt = opt.addChoices({ name: choice.name, value: choice.value });
    }
    return opt;
  });

export const translateCommand: SlashCommandDefinition = {
  kind: "chatInput",
  name: "translate",
  builder,
  handler: handleTranslateSlash,
  toJSON: () => builder.toJSON(),
};
