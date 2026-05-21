const REGIONAL_INDICATOR_A = 0x1f1e6;

/**
 * Parses a Unicode flag emoji (two regional indicators) into ISO 3166-1 alpha-2.
 * Returns null for non-flag emojis.
 */
export function parseFlagEmoji(emoji: string): string | null {
  const codePoints = [...emoji].map((char) => char.codePointAt(0) ?? 0);
  if (codePoints.length !== 2) {
    return null;
  }

  const [first, second] = codePoints;
  if (
    first < REGIONAL_INDICATOR_A ||
    first > REGIONAL_INDICATOR_A + 25 ||
    second < REGIONAL_INDICATOR_A ||
    second > REGIONAL_INDICATOR_A + 25
  ) {
    return null;
  }

  const alpha1 = String.fromCharCode(65 + (first - REGIONAL_INDICATOR_A));
  const alpha2 = String.fromCharCode(65 + (second - REGIONAL_INDICATOR_A));
  return `${alpha1}${alpha2}`;
}
