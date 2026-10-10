import type { Locale } from '@data/types';

export const locales: Locale[] = ['pt', 'en'];
export const defaultLocale: Locale = 'pt';

export function otherLocale(locale: Locale): Locale {
  return locale === 'pt' ? 'en' : 'pt';
}

export function pathForLocale(locale: Locale): string {
  return locale === 'pt' ? '/' : '/en/';
}

export function alternateLocaleUrl(pathname: string, locale: Locale, site = ''): string {
  const other = otherLocale(locale);
  const suffix = other === 'pt' ? '/' : '/en/';
  const base = site || new URL(pathname, 'http://localhost').origin;
  return new URL(suffix, base).href;
}
