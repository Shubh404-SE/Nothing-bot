import type { AppServices } from "../core/app-context.js";
import { registerTranslationModule } from "../modules/translation/index.js";
import { CommandRegistry } from "./registry.js";

export function registerAllCommands(ctx: AppServices): CommandRegistry {
  const registry = new CommandRegistry();
  registerTranslationModule(registry, ctx);
  return registry;
}

export { CommandRegistry } from "./registry.js";
export type {
  CommandDefinition,
  MessageContextMenuCommandDefinition,
  MessageContextMenuCommandHandler,
  SlashCommandDefinition,
  SlashCommandHandler,
} from "./types.js";
