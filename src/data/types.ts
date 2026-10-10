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

export type ProjectStatus = 'live' | 'wip' | 'placeholder';

export interface Project {
  id: string;
  title: string;
  tagline: Localized<string>;
  readme: Localized<string>;
  stack: string[];
  status: ProjectStatus;
  links?: { repo?: string; demo?: string };
  screenshot?: string;
}

export interface StackGroup {
  id: string;
  label: Localized<string>;
  items: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: Localized<string>;
  period: string;
  summary: Localized<string>;
}

export interface Award {
  id: string;
  title: Localized<string>;
  issuer: string;
  year: number;
}
