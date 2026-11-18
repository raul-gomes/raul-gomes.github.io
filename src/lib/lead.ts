/** A rendered body split into its opening paragraph and everything after it. */
export interface LeadSplit {
  /** The first `<p>…</p>` when the body opens with one; empty otherwise. */
  lead: string;
  /** The remaining HTML (the whole body when there is no opening paragraph). */
  rest: string;
}

const OPENING_PARAGRAPH = /^\s*(<p>[\s\S]*?<\/p>)\s*/;

/**
 * Split rendered Markdown so a compact card can show the opening paragraph and
 * keep the rest of the case study collapsed.
 */
export function splitLead(html: string): LeadSplit {
  const match = OPENING_PARAGRAPH.exec(html);
  if (!match) return { lead: '', rest: html };
  return { lead: match[1], rest: html.slice(match[0].length) };
}
