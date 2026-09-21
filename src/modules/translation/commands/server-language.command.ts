import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import type { SlashCommandDefinition } from "../../../commands/types.js";
import { handleServerLanguageCommand } from "../handlers/server-language.handler.js";
import { SLASH_LANGUAGE_CHOICES } from "../language-display.js";

const builder = new SlashCommandBuilder()
  .setName("server-language")
  .setDescription("Set this server's default translation language")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption((option) => {
    let opt = option
      .setName("language")
      .setDescription("The server's default target language")
      .setRequired(true);
    for (const choice of SLASH_LANGUAGE_CHOICES) {
      opt = opt.addChoices({ name: choice.name, value: choice.value });
    }
    return opt;
  });

export const serverLanguageCommand: SlashCommandDefinition = {
  kind: "chatInput",
  name: "server-language",
  builder,
  handler: handleServerLanguageCommand,
  toJSON: () => builder.toJSON(),
};
