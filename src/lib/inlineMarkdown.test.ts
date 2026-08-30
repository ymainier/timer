import { describe, it, expect } from "vitest";
import { parseInlineMarkdown } from "./inlineMarkdown";

describe("parseInlineMarkdown", () => {
  it("parses bold with ** and __", () => {
    expect(parseInlineMarkdown("**hi**")).toEqual([{ type: "bold", value: "hi" }]);
    expect(parseInlineMarkdown("__hi__")).toEqual([{ type: "bold", value: "hi" }]);
  });

  it("parses italic with * and _", () => {
    expect(parseInlineMarkdown("*hi*")).toEqual([{ type: "italic", value: "hi" }]);
    expect(parseInlineMarkdown("_hi_")).toEqual([{ type: "italic", value: "hi" }]);
  });

  it("mixes emphasis with surrounding text", () => {
    expect(parseInlineMarkdown("10x **push-ups** then *rest*")).toEqual([
      { type: "text", value: "10x " },
      { type: "bold", value: "push-ups" },
      { type: "text", value: " then " },
      { type: "italic", value: "rest" },
    ]);
  });

  it("keeps raw HTML as literal text (never a tag)", () => {
    expect(parseInlineMarkdown("<b>x</b> & <i>y</i>")).toEqual([
      { type: "text", value: "<b>x</b> & <i>y</i>" },
    ]);
  });

  it("does not interpret links or code spans", () => {
    expect(parseInlineMarkdown("see [demo](http://x) or `code`")).toEqual([
      { type: "text", value: "see [demo](http://x) or `code`" },
    ]);
  });

  it("leaves unclosed markers as literal text", () => {
    expect(parseInlineMarkdown("**oops")).toEqual([{ type: "text", value: "**oops" }]);
    expect(parseInlineMarkdown("a * b")).toEqual([{ type: "text", value: "a * b" }]);
  });

  it("returns nothing for an empty string", () => {
    expect(parseInlineMarkdown("")).toEqual([]);
  });
});
