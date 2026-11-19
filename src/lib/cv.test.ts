import { describe, it, expect } from 'vitest';
import { CV_MAX_STACK, buildCvProjects, extractBullets, summaryParagraphs, type CvProjectInput } from './cv';

const project = (overrides: Partial<CvProjectInput>): CvProjectInput => ({
  slug: 'demo',
  title: 'Demo',
  status: 'live',
  order: 1,
  stack: ['Python'],
  cv: { goal: 'Goal.', highlights: [] },
  ...overrides,
});

describe('buildCvProjects', () => {
  it('keeps live and wip projects and drops placeholders', () => {
    const result = buildCvProjects([
      project({ slug: 'a', status: 'live' }),
      project({ slug: 'b', status: 'wip' }),
      project({ slug: 'c', status: 'placeholder', cv: undefined }),
    ]);
    expect(result.map((item) => item.slug)).toEqual(['a', 'b']);
  });

  it('sorts by order', () => {
    const result = buildCvProjects([project({ slug: 'late', order: 9 }), project({ slug: 'early', order: 1 })]);
    expect(result.map((item) => item.slug)).toEqual(['early', 'late']);
  });

  it('limits the stack to the first CV_MAX_STACK technologies', () => {
    const stack = Array.from({ length: CV_MAX_STACK + 3 }, (_, index) => `tech-${index}`);
    const [result] = buildCvProjects([project({ stack })]);
    expect(result.stack).toEqual(stack.slice(0, CV_MAX_STACK));
  });

  it('flags work-in-progress projects', () => {
    const [live, wip] = buildCvProjects([project({ slug: 'a', order: 1 }), project({ slug: 'b', order: 2, status: 'wip' })]);
    expect(live.inProgress).toBe(false);
    expect(wip.inProgress).toBe(true);
  });

  it('carries the goal and highlights from the cv field', () => {
    const [result] = buildCvProjects([project({ cv: { goal: 'Solve X.', highlights: ['Did Y.'] } })]);
    expect(result.goal).toBe('Solve X.');
    expect(result.highlights).toEqual(['Did Y.']);
  });

  it('fails when a published project has no cv summary', () => {
    expect(() => buildCvProjects([project({ slug: 'naked', cv: undefined })])).toThrow(/naked/);
  });
});

describe('extractBullets', () => {
  it('returns the top-level list items of a markdown body', () => {
    const body = 'Intro paragraph.\n\n## Atividades\n\n- First item\n- Second item\n';
    expect(extractBullets(body)).toEqual(['First item', 'Second item']);
  });

  it('accepts asterisk bullets and trims whitespace', () => {
    expect(extractBullets('*   Spaced item  ')).toEqual(['Spaced item']);
  });

  it('ignores nested list items', () => {
    expect(extractBullets('- Parent\n  - Child')).toEqual(['Parent']);
  });

  it('returns an empty list when there are no bullets', () => {
    expect(extractBullets('Just text.')).toEqual([]);
  });
});

describe('summaryParagraphs', () => {
  it('returns the first paragraphs of the long bio', () => {
    expect(summaryParagraphs('One.\n\nTwo.\n\nThree.', 2)).toEqual(['One.', 'Two.']);
  });
});
