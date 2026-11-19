import type { Localized } from './types';

export interface CvLabels {
  documentTitle: string;
  summary: string;
  skills: string;
  projects: string;
  experience: string;
  education: string;
  certifications: string;
  languages: string;
  inProgress: string;
  stack: string;
}

/** Section titles and labels of the generated CV, per locale. */
export const cvLabels: Localized<CvLabels> = {
  pt: {
    documentTitle: 'Currículo',
    summary: 'Resumo',
    skills: 'Habilidades',
    projects: 'Projetos',
    experience: 'Experiência profissional',
    education: 'Formação',
    certifications: 'Certificações e prêmios',
    languages: 'Idiomas',
    inProgress: 'em desenvolvimento',
    stack: 'Stack',
  },
  en: {
    documentTitle: 'Resume',
    summary: 'Summary',
    skills: 'Skills',
    projects: 'Projects',
    experience: 'Professional experience',
    education: 'Education',
    certifications: 'Certifications and awards',
    languages: 'Languages',
    inProgress: 'in progress',
    stack: 'Stack',
  },
};
