export type Locale = 'pt' | 'en';
export type Localized<T> = Record<Locale, T>;

export interface Profile {
  name: string;
  handle: string;
  role: Localized<string>;
  location: Localized<string>;
  email: string;
  github: string;
  linkedin: string;
  cvPath: string;
  bioShort: Localized<string>;
  bioLong: Localized<string>;
}

export interface StackGroup {
  id: string;
  label: Localized<string>;
  items: string[];
}

export interface Award {
  id: string;
  title: Localized<string>;
  issuer: string;
  year: number;
}
