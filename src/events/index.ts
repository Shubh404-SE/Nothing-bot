import type { Client } from "discord.js";

import type { AppContext } from "../core/container.js";
import { registerInteractionCreateEvent } from "./interaction-create.event.js";
import { registerMessageReactionAddEvent } from "./message-reaction-add.event.js";
import { registerReadyEvent } from "./ready.event.js";

export function registerEvents(client: Client, ctx: AppContext): void {
  registerReadyEvent(client, ctx);
  registerInteractionCreateEvent(client, ctx);
  registerMessageReactionAddEvent(client, ctx);
}
