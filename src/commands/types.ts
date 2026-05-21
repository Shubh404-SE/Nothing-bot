import type {
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

import type { AppContext } from "../core/app-context.js";

export type SlashCommandHandler = (
  interaction: ChatInputCommandInteraction,
  ctx: AppContext,
) => Promise<void>;

export type SlashCommandDefinition = {
  name: string;
  builder:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  handler: SlashCommandHandler;
  toJSON: () => RESTPostAPIChatInputApplicationCommandsJSONBody;
};
