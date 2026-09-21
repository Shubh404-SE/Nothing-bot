import {
  DiscordAPIError,
  type Interaction,
  type InteractionEditReplyOptions,
  type Message,
  type MessageReplyOptions,
  type InteractionReplyOptions,
  type RepliableInteraction,
} from "discord.js";

import { UserFacingError } from "../shared/errors/user-facing.error.js";
import { errorEmbed } from "./embeds.js";

export async function safeReplyInteraction(
  interaction: Interaction,
  options: InteractionReplyOptions,
): Promise<void> {
  if (!interaction.isRepliable()) {
    return;
  }

  try {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(options);
      return;
    }
    await interaction.reply(options);
  } catch (error) {
    if (isIgnorableDiscordError(error)) {
      return;
    }
    throw error;
  }
}

export async function safeReplyMessage(
  message: Message,
  options: MessageReplyOptions,
): Promise<Message | null> {
  try {
    return await message.reply(options);
  } catch (error) {
    if (isIgnorableDiscordError(error)) {
      return null;
    }
    throw error;
  }
}

export async function replyWithUserFacingError(
  interaction: Interaction,
  error: unknown,
): Promise<void> {
  const message =
    error instanceof UserFacingError
      ? error.userMessage
      : "Something went wrong. Please try again later.";

  await safeReplyInteraction(interaction, {
    embeds: [errorEmbed(message)],
    ephemeral: true,
  });
}

export async function safeEditReply(
  interaction: RepliableInteraction,
  options: InteractionEditReplyOptions,
): Promise<Message | null> {
  try {
    return await interaction.editReply(options);
  } catch (error) {
    if (isIgnorableDiscordError(error)) {
      return null;
    }
    throw error;
  }
}

export async function editReplyWithUserFacingError(
  interaction: RepliableInteraction,
  error: unknown,
): Promise<void> {
  const message =
    error instanceof UserFacingError
      ? error.userMessage
      : "Something went wrong. Please try again later.";

  await safeEditReply(interaction, {
    embeds: [errorEmbed(message)],
    components: [],
  });
}

function isIgnorableDiscordError(error: unknown): boolean {
  if (!(error instanceof DiscordAPIError)) {
    return false;
  }
  return error.code === 10062 || error.code === 10008 || error.code === 50013;
}
