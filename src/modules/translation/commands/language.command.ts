import {
  ApplicationIntegrationType,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";

import type { SlashCommandDefinition } from "../../../commands/types.js";
import { handleLanguageCommand } from "../handlers/language.handler.js";
import { SLASH_LANGUAGE_CHOICES } from "../language-display.js";

const builder = new SlashCommandBuilder()
  .setName("language")
  .setDescription("Manage your personal default translation language")
  .setIntegrationTypes(
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel,
  )
  .addSubcommand((sub) => {
    let subcommand = sub.setName("set").setDescription("Set your default translation language");
    subcommand = subcommand.addStringOption((option) => {
      let opt = option
        .setName("language")
        .setDescription("Your default target language")
        .setRequired(true);
      for (const choice of SLASH_LANGUAGE_CHOICES) {
        opt = opt.addChoices({ name: choice.name, value: choice.value });
      }
      return opt;
    });
    return subcommand;
  })
  .addSubcommand((sub) => sub.setName("show").setDescription("Show your current default language"));

export const languageCommand: SlashCommandDefinition = {
  kind: "chatInput",
  name: "language",
  builder,
  handler: handleLanguageCommand,
  toJSON: () => builder.toJSON(),
};
