import type { ChatInputCommandInteraction, MessageContextMenuCommandInteraction } from "discord.js";

import type { AppContext } from "../core/app-context.js";
import type { CommandDefinition } from "./types.js";

function registryKey(kind: CommandDefinition["kind"], name: string): string {
  return `${kind}:${name}`;
}

export class CommandRegistry {
  private readonly commands = new Map<string, CommandDefinition>();

  register(definition: CommandDefinition): void {
    const key = registryKey(definition.kind, definition.name);
    if (this.commands.has(key)) {
      throw new Error(`Command already registered: ${definition.kind}:${definition.name}`);
    }
    this.commands.set(key, definition);
  }

  getDefinition(kind: CommandDefinition["kind"], name: string): CommandDefinition | undefined {
    return this.commands.get(registryKey(kind, name));
  }

  getAllDefinitions(): CommandDefinition[] {
    return [...this.commands.values()];
  }

  async dispatchChatInput(
    interaction: ChatInputCommandInteraction,
    ctx: AppContext,
  ): Promise<boolean> {
    const definition = this.getDefinition("chatInput", interaction.commandName);
    if (!definition || definition.kind !== "chatInput") {
      return false;
    }
    await definition.handler(interaction, ctx);
    return true;
  }

  async dispatchMessageContextMenu(
    interaction: MessageContextMenuCommandInteraction,
    ctx: AppContext,
  ): Promise<boolean> {
    const definition = this.getDefinition("messageContextMenu", interaction.commandName);
    if (!definition || definition.kind !== "messageContextMenu") {
      return false;
    }
    await definition.handler(interaction, ctx);
    return true;
  }
}
