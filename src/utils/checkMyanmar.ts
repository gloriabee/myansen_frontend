export function isMyanmarText(text: string): boolean {
  const myanmarRegex = /[\u1000-\u109F\uAA60-\uAA7F]/;
  return myanmarRegex.test(text);
}
