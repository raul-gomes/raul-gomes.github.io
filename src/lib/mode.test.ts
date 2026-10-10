import { describe, it, expect } from 'vitest';
import { DEFAULT_MODE, modeHref, otherMode, parseModeParam, resolveMode } from './mode';

describe('parseModeParam', () => {
  it('reads a valid mode from the query string', () => {
    expect(parseModeParam('?mode=desktop')).toBe('desktop');
    expect(parseModeParam('?foo=1&mode=reader')).toBe('reader');
  });

  it('ignores invalid or missing values', () => {
    expect(parseModeParam('')).toBeNull();
    expect(parseModeParam('?mode=banana')).toBeNull();
  });
});

describe('resolveMode', () => {
  it('prefers the query param over storage', () => {
    expect(resolveMode('?mode=desktop', 'reader')).toBe('desktop');
  });

  it('falls back to storage when the param is absent', () => {
    expect(resolveMode('', 'desktop')).toBe('desktop');
  });

  it('defaults to reader without any preference', () => {
    expect(resolveMode('', null)).toBe(DEFAULT_MODE);
    expect(resolveMode('?mode=nope', 'nope')).toBe('reader');
  });
});

describe('otherMode', () => {
  it('flips between modes', () => {
    expect(otherMode('reader')).toBe('desktop');
    expect(otherMode('desktop')).toBe('reader');
  });
});

describe('modeHref', () => {
  it('preserves the path and sets the mode param', () => {
    expect(modeHref('desktop', '/en/')).toBe('/en/?mode=desktop');
    expect(modeHref('reader', '/')).toBe('/?mode=reader');
  });

  it('replaces an existing mode param', () => {
    expect(modeHref('desktop', '/en/?mode=reader&x=1')).toBe('/en/?mode=desktop&x=1');
  });
});
