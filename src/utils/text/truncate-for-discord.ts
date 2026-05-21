export type TruncateResult = {
  text: string;
  truncated: boolean;
};

export function truncateForDiscord(text: string, maxLength: number): TruncateResult {
  if (text.length <= maxLength) {
    return { text, truncated: false };
  }
  return {
    text: `${text.slice(0, maxLength - 3)}...`,
    truncated: true,
  };
}
