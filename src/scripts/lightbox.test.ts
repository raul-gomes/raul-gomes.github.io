import { describe, it, expect } from 'vitest';
import { stepIndex } from './lightbox';

describe('stepIndex', () => {
  it('moves forward and backward inside the gallery', () => {
    expect(stepIndex(1, 1, 5)).toBe(2);
    expect(stepIndex(3, -1, 5)).toBe(2);
  });

  it('wraps around both ends', () => {
    expect(stepIndex(4, 1, 5)).toBe(0);
    expect(stepIndex(0, -1, 5)).toBe(4);
  });

  it('stays at zero for a single image', () => {
    expect(stepIndex(0, 1, 1)).toBe(0);
    expect(stepIndex(0, -1, 1)).toBe(0);
  });
});
