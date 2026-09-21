import {
  ApplicationCommandType,
  ApplicationIntegrationType,
  ContextMenuCommandBuilder,
  InteractionContextType,
} from "discord.js";

import type { MessageContextMenuCommandDefinition } from "../../../commands/types.js";
import { handleTranslateMessageContextMenu } from "../handlers/translate-context-menu.handler.js";

const builder = new ContextMenuCommandBuilder()
  .setName("Translate Message")
  .setType(ApplicationCommandType.Message)
  .setIntegrationTypes(
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel,
  );

export const translateMessageContextMenuCommand: MessageContextMenuCommandDefinition = {
  kind: "messageContextMenu",
  name: "Translate Message",
  builder,
  handler: handleTranslateMessageContextMenu,
  toJSON: () => builder.toJSON(),
};
