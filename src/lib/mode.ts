export type Mode = 'reader' | 'desktop';

export const MODE_KEY = 'portfolio.mode';
export const MODE_PARAM = 'mode';
export const DEFAULT_MODE: Mode = 'reader';

function isMode(value: unknown): value is Mode {
  return value === 'reader' || value === 'desktop';
}

export function parseModeParam(search: string): Mode | null {
  const value = new URLSearchParams(search).get(MODE_PARAM);
  return isMode(value) ? value : null;
}

export function resolveMode(search: string, stored: string | null): Mode {
  return parseModeParam(search) ?? (isMode(stored) ? stored : DEFAULT_MODE);
}

export function otherMode(mode: Mode): Mode {
  return mode === 'reader' ? 'desktop' : 'reader';
}

export function modeHref(mode: Mode, path: string): string {
  const url = new URL(path, 'http://localhost');
  url.searchParams.set(MODE_PARAM, mode);
  return `${url.pathname}${url.search}`;
}
