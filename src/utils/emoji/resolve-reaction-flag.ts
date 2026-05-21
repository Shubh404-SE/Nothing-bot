import type { APIPartialEmoji, Emoji } from "discord.js";

import { parseFlagEmoji } from "./parse-flag-emoji.js";

/**
 * Discord custom flag emojis use names like `flag_in`, `flag_us`, `flag_gb`.
 * Plain names like `us` or `usa` are NOT treated as flags (avoids false US defaults).
 */
const CUSTOM_FLAG_NAME = /^flag[_-]([a-z]{2})(?:[_-].*)?$/i;

export type ResolvedReactionFlag = {
  countryCode: string;
};

export function resolveReactionFlag(emoji: Emoji | APIPartialEmoji): ResolvedReactionFlag | null {
  const name = emoji.name;
  if (!name) {
    return null;
  }

  if ("id" in emoji && emoji.id) {
    const customMatch = name.match(CUSTOM_FLAG_NAME);
    if (customMatch?.[1]) {
      return { countryCode: customMatch[1].toUpperCase() };
    }
    return null;
  }

  const countryCode = parseFlagEmoji(name);
  if (!countryCode) {
    return null;
  }

  return { countryCode };
}
