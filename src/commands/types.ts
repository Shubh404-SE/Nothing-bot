import type {
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

import type { AppContext } from "../core/app-context.js";

export type SlashCommandHandler = (
  interaction: ChatInputCommandInteraction,
  ctx: AppContext,
) => Promise<void>;

export type MessageContextMenuCommandHandler = (
  interaction: MessageContextMenuCommandInteraction,
  ctx: AppContext,
) => Promise<void>;

export type SlashCommandDefinition = {
  kind: "chatInput";
  name: string;
  builder:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  handler: SlashCommandHandler;
  toJSON: () => RESTPostAPIChatInputApplicationCommandsJSONBody;
};

export type MessageContextMenuCommandDefinition = {
  kind: "messageContextMenu";
  name: string;
  builder: ContextMenuCommandBuilder;
  handler: MessageContextMenuCommandHandler;
  toJSON: () => RESTPostAPIContextMenuApplicationCommandsJSONBody;
};

export type CommandDefinition = SlashCommandDefinition | MessageContextMenuCommandDefinition;
