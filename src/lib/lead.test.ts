import { describe, it, expect } from 'vitest';
import { splitLead } from './lead';

describe('splitLead', () => {
  it('separates the first paragraph from the rest of the body', () => {
    const html = '<p>Intro <strong>curta</strong>.</p>\n<h2>A história</h2>\n<p>Mais.</p>';
    expect(splitLead(html)).toEqual({ lead: '<p>Intro <strong>curta</strong>.</p>', rest: '<h2>A história</h2>\n<p>Mais.</p>' });
  });

  it('skips leading whitespace before the first paragraph', () => {
    expect(splitLead('\n  <p>Só isso.</p>')).toEqual({ lead: '<p>Só isso.</p>', rest: '' });
  });

  it('keeps everything as the rest when the body does not start with a paragraph', () => {
    const html = '<h2>Título</h2><p>Texto.</p>';
    expect(splitLead(html)).toEqual({ lead: '', rest: html });
  });

  it('handles an empty body', () => {
    expect(splitLead('')).toEqual({ lead: '', rest: '' });
  });
});
