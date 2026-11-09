import type { Localized } from './types';

export interface EducationEntry {
  id: string;
  course: Localized<string>;
  institution: Localized<string>;
  period: string;
}

export const education: EducationEntry[] = [
  {
    id: 'puc-campinas',
    course: {
      pt: 'Especialização em Ciência de Dados e Machine Learning',
      en: 'Specialization in Data Science and Machine Learning',
    },
    institution: {
      pt: 'Pontifícia Universidade Católica de Campinas',
      en: 'Pontifícia Universidade Católica de Campinas',
    },
    period: '2023',
  },
  {
    id: 'ucb-ads',
    course: {
      pt: 'Análise e Desenvolvimento de Sistemas',
      en: 'Systems Analysis and Development',
    },
    institution: {
      pt: 'Universidade Católica de Brasília',
      en: 'Universidade Católica de Brasília',
    },
    period: '2017 – 2019',
  },
  {
    id: 'erin-school',
    course: {
      pt: 'Inglês Avançado',
      en: 'Advanced English',
    },
    institution: {
      pt: 'Erin School (Irlanda)',
      en: 'Erin School (Ireland)',
    },
    period: '2015 – 2016',
  },
  {
    id: 'etb',
    course: {
      pt: 'Técnico em Informática',
      en: 'Technical Degree in Information Technology',
    },
    institution: {
      pt: 'Escola Técnica de Brasília',
      en: 'Escola Técnica de Brasília',
    },
    period: '2002 – 2003',
  },
];

export const languages: Localized<string>[] = [
  { pt: 'Português (nativo)', en: 'Portuguese (native)' },
  { pt: 'Inglês (fluente)', en: 'English (fluent)' },
  { pt: 'Espanhol (básico)', en: 'Spanish (basic)' },
  { pt: 'Francês (básico)', en: 'French (basic)' },
];
