// utils/breakSyllable.ts

/**
 * Approximate re-implementation of Ye Kyaw Thu's syllable breaking for Myanmar.
 * Based on: https://github.com/ye-kyaw-thu/myanmar-tools/blob/master/sylbreak/sylbreak.py
 */

/**
 * Breaks Myanmar text into syllables based on Ye Kyaw Thu's original regex.
 * @param text The Myanmar text input.
 * @param separator Delimiter to use (default is '|').
 * @returns An array of syllables.
 */
export function breakMyanmarSyllables(text: string, separator = "|"): string[] {
  const myConsonant = "က-အ";
  const enChar = "a-zA-Z0-9";
  const otherChar = "ဣဤဥဦဧဩဪဿ၌၍၏၀-၉၊။!-/:-@[-`{-~\\s";
  const subscript = "္";
  const aThat = "်";

  // Equivalent of create_break_pattern()
  const breakPattern = new RegExp(
    `((?<!${subscript})[${myConsonant}](?![${aThat}${subscript}])|[${enChar}${otherChar}])`,
    "gu" // Unicode-aware global search
  );

  // Normalize whitespace
  const cleaned = text.trim().replace(/\s+/g, " ");

  // Insert separator before each match
  const segmented = cleaned.replace(breakPattern, `${separator}$1`);

  // Remove leading separator (if any)
  const normalized = segmented.startsWith(separator)
    ? segmented.slice(separator.length)
    : segmented;

  // Replace double delimiters with single space (as in Python version)
  const cleanedResult = normalized.replace(
    new RegExp(`${separator} ${separator}`, "g"),
    " "
  );

  // Split by separator into syllables
  return cleanedResult
    .split(separator)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Count the number of Myanmar syllables in text.
 * @param text Input text.
 * @returns Number of syllables.
 */
export function countMyanmarSyllables(text: string): number {
  return breakMyanmarSyllables(text).length;
}
