// Cheap, dependency-free English gate. Finnhub's merger/crypto market-news
// buckets mix in non-English press-wire releases (Business Wire publishes the
// same M&A story in many languages). We only want English, so reject anything
// that looks otherwise.

// Non-Latin scripts: Greek, Cyrillic, Hebrew, Arabic, CJK, Kana, Hangul.
const NON_LATIN =
  /[Ͱ-ϿЀ-ӿ֐-׿؀-ۿ぀-ヿ一-鿿가-힯]/;

// Latin letters that strongly signal a non-English language (Polish, German ß,
// Turkish, …). Common accented vowels (é, ñ, ü, …) are intentionally excluded
// so English loanwords and brand names ("Nestlé") still pass.
const FOREIGN_LATIN = /[łżźćśńęąĄŁŻŹĆŚŃĘßıİşŞğĞ]/;

// High-frequency English function words — longer English text reliably contains
// several; foreign-language text reliably contains none.
const ENGLISH_FUNCTION_WORDS =
  /\b(the|and|for|with|that|from|this|will|has|have|are|after|over|amid|its|to|of|in|on|as|at|by)\b/;

export function isLikelyEnglish(headline: string, summary = ""): boolean {
  const text = `${headline} ${summary}`.trim();
  if (!text) return false;
  if (NON_LATIN.test(text) || FOREIGN_LATIN.test(text)) return false;
  const lower = text.toLowerCase();
  // Short headlines may legitimately lack function words; only judge longer text.
  if (lower.split(/\s+/).length <= 5) return true;
  return ENGLISH_FUNCTION_WORDS.test(lower);
}
