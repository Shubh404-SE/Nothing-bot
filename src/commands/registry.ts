import type { ChatInputCommandInteraction } from "discord.js";

import type { AppContext } from "../core/app-context.js";
import type { SlashCommandDefinition } from "./types.js";

export class CommandRegistry {
  private readonly commands = new Map<string, SlashCommandDefinition>();

  register(definition: SlashCommandDefinition): void {
    if (this.commands.has(definition.name)) {
      throw new Error(`Command already registered: ${definition.name}`);
    }
    this.commands.set(definition.name, definition);
  }

  getDefinition(name: string): SlashCommandDefinition | undefined {
    return this.commands.get(name);
  }

  getAllDefinitions(): SlashCommandDefinition[] {
    return [...this.commands.values()];
  }

  async dispatch(interaction: ChatInputCommandInteraction, ctx: AppContext): Promise<boolean> {
    const definition = this.commands.get(interaction.commandName);
    if (!definition) {
      return false;
    }
    await definition.handler(interaction, ctx);
    return true;
  }
}
