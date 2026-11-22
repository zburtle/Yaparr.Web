/** The guides as data (learn-content.ts, made from docs/guides in the Yaparr repository by scripts/sync-learn.mjs). */

/** A piece of a line: plain text, **bold**, *italic*, `code`, or a link to another page of the site (`to`, with a `fragment` for a heading) or to somewhere else (`href`). */
export type Inline =
  | { k: 'text' | 'strong' | 'em' | 'code'; t: string }
  | { k: 'link'; t: string; to?: string; fragment?: string; href?: string };

export type Block = { k: 'p'; i: Inline[] } | { k: 'ul'; items: Inline[][] };

export interface Section {
  /** The anchor of the heading, the one the apps link to. Absent for what comes before the first heading. */
  id?: string;
  heading?: string;
  blocks: Block[];
}

export interface Page {
  slug: string;
  title: string;
  sections: Section[];
}

export interface Content {
  title: string;
  intro: Inline[][];
  pages: Page[];
  /** The index's list: a link to each guide and a few words about it. */
  listed: Inline[][];
}
