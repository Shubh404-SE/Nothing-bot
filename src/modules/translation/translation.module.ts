import type { MessageReaction, User } from "discord.js";

import type { CommandRegistry } from "../../commands/registry.js";
import type { AppContext, AppServices } from "../../core/app-context.js";
import { translateCommand } from "./commands/translate.command.js";
import { handleTranslateReaction } from "./handlers/translate-reaction.handler.js";

export function registerTranslationModule(registry: CommandRegistry, _ctx: AppServices): void {
  registry.register(translateCommand);
}

export function createReactionHandler(ctx: AppContext) {
  return async (reaction: MessageReaction, user: User): Promise<void> => {
    await handleTranslateReaction(reaction, user, ctx);
  };
}
