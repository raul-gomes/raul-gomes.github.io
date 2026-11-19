import { describe, it, expect } from 'vitest';
import { profile } from '../data/profile';
import { CV_TARGETS } from '../../scripts/cv-targets.mjs';

describe('CV_TARGETS', () => {
  it('prints each locale to the PDF the site links to', () => {
    for (const target of CV_TARGETS) {
      expect(`/${target.pdf}`).toBe(profile.cvPath[target.locale as 'pt' | 'en']);
    }
    expect(CV_TARGETS.map((target) => target.locale).sort()).toEqual(['en', 'pt']);
  });
});
