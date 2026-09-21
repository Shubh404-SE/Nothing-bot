import type { Message } from "discord.js";

export function resolveMessageSpeakerName(message: Message): string {
  return message.author.displayName && message.guild
    ? message.author.displayName
    : message.author.username;
}
