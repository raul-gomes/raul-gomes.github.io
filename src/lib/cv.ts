/**
 * Pure helpers that turn portfolio content into the compact data shown on the CV.
 * The CV pages (src/pages/cv, src/pages/en/cv) render this data, and the build
 * prints those pages to PDF, so the CV always reflects the current content.
 */

/** Maximum number of technologies listed per project on the CV. */
export const CV_MAX_STACK = 6;

/** Number of bio paragraphs used as the CV summary. */
export const CV_SUMMARY_PARAGRAPHS = 2;

/** Project statuses that are published on the CV. */
const CV_STATUSES = new Set(['live', 'wip']);

export interface CvSummary {
  goal: string;
  highlights: string[];
}

export interface CvProjectInput {
  slug: string;
  title: string;
  status: 'live' | 'wip' | 'placeholder';
  order: number;
  stack: string[];
  cv?: CvSummary;
}

export interface CvProject {
  slug: string;
  title: string;
  inProgress: boolean;
  goal: string;
  highlights: string[];
  stack: string[];
}

/**
 * Selects the projects that go on the CV (live and wip), sorted by `order`,
 * with the stack trimmed to {@link CV_MAX_STACK} items.
 * @throws Error when a published project has no `cv` summary in its frontmatter.
 */
export function buildCvProjects(projects: CvProjectInput[]): CvProject[] {
  return projects
    .filter((project) => CV_STATUSES.has(project.status))
    .sort((a, b) => a.order - b.order)
    .map((project) => {
      if (!project.cv) {
        throw new Error(`Project "${project.slug}" is published but has no "cv" summary in its frontmatter.`);
      }
      return {
        slug: project.slug,
        title: project.title,
        inProgress: project.status === 'wip',
        goal: project.cv.goal,
        highlights: project.cv.highlights,
        stack: project.stack.slice(0, CV_MAX_STACK),
      };
    });
}

const TOP_LEVEL_BULLET = /^[-*]\s+(.+)$/;

/** Returns the text of the top-level list items in a markdown body. */
export function extractBullets(markdown: string): string[] {
  return markdown
    .split('\n')
    .map((line) => TOP_LEVEL_BULLET.exec(line)?.[1]?.trim())
    .filter((item): item is string => Boolean(item));
}

/** Returns the first `count` paragraphs of a text whose paragraphs are separated by blank lines. */
export function summaryParagraphs(text: string, count: number): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .slice(0, count);
}
