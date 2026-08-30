/**
 * Inline markdown for Exercises: bold and italic only. Everything else —
 * links, code spans, block structure, raw HTML — is left as literal text.
 * Parsing to a flat token list keeps it pure and testable; the React renderer
 * turns tokens into elements, and because token values render as text children
 * any raw HTML is escaped by React rather than injected into the DOM.
 */
export type InlineToken =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "italic"; value: string };

const PATTERNS: { type: "bold" | "italic"; re: RegExp }[] = [
  { type: "bold", re: /^\*\*([^*]+)\*\*/ },
  { type: "bold", re: /^__([^_]+)__/ },
  { type: "italic", re: /^\*([^*]+)\*/ },
  { type: "italic", re: /^_([^_]+)_/ },
];

export function parseInlineMarkdown(input: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let text = "";
  const flush = () => {
    if (text) {
      tokens.push({ type: "text", value: text });
      text = "";
    }
  };

  let i = 0;
  while (i < input.length) {
    const rest = input.slice(i);
    let matched = false;
    for (const { type, re } of PATTERNS) {
      const m = re.exec(rest);
      if (m) {
        flush();
        tokens.push({ type, value: m[1] });
        i += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      text += input[i];
      i += 1;
    }
  }
  flush();
  return tokens;
}
