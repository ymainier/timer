import { parseInlineMarkdown } from "../lib/inlineMarkdown";

/**
 * Render one Exercise's inline markdown — bold and italic only. Token values
 * render as text children, so any raw HTML is escaped by React, never injected.
 */
export function InlineMarkdown({ text }: { text: string }) {
  return (
    <>
      {parseInlineMarkdown(text).map((token, i) => {
        switch (token.type) {
          case "bold":
            return <strong key={i}>{token.value}</strong>;
          case "italic":
            return <em key={i}>{token.value}</em>;
          default:
            return <span key={i}>{token.value}</span>;
        }
      })}
    </>
  );
}
