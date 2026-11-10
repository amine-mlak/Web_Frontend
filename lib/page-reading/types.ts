/**
 * Reading text for a single page, written in code until the CMS holds a real one.
 * A paragraph that starts with "## " is a sub-heading.
 */
export type PageCopy = {
  heading: string;
  paragraphs: string[];
  /** Meta description, one or two plain sentences. */
  description: string;
  /** Replaces the short CMS line under the page title when that line is not usable. */
  lede?: string;
};

export type PageCopySet = Record<string, { de: PageCopy; en: PageCopy }>;
