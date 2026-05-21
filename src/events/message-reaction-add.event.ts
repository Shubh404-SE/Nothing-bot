import type { Client } from "discord.js";

import type { AppContext } from "../core/app-context.js";
import { createReactionHandler } from "../modules/translation/index.js";

export function registerMessageReactionAddEvent(client: Client, ctx: AppContext): void {
  const onReaction = createReactionHandler(ctx);

  client.on("messageReactionAdd", async (reaction, user) => {
    try {
      const fullReaction = reaction.partial ? await reaction.fetch() : reaction;
      const fullUser = user.partial ? await user.fetch() : user;
      if (fullUser.bot) {
        return;
      }
      await onReaction(fullReaction, fullUser);
    } catch (error) {
      ctx.logger.error({ err: error }, "Reaction handler failed");
    }
  });
}
