export interface SkillContext {
  projects: string[];
  experience: string[];
}

/**
 * Slugs de projetos e experiências relacionados a cada grupo de skills.
 * Os títulos exibidos são resolvidos no locale atual pelo componente.
 */
export const skillContext: Record<string, SkillContext> = {
  languages: {
    projects: ['cafe-com-bpo', 'placo', 'record', 'eldorado', 'pipeline-dados-databricks', 'nacao-patina'],
    experience: ['freelancer', 'record', 'eldorado'],
  },
  backend: {
    projects: ['cafe-com-bpo', 'placo', 'record', 'nacao-patina', 'sindico-indica', 'transcricao-whisper'],
    experience: ['freelancer', 'record', 'eldorado', 'gp'],
  },
  frontend: {
    projects: ['cafe-com-bpo', 'placo', 'record', 'nacao-patina', 'sindico-indica'],
    experience: ['freelancer', 'record', 'eldorado'],
  },
  data: {
    projects: ['cafe-com-bpo', 'placo', 'record', 'pipeline-dados-databricks'],
    experience: ['record', 'eldorado', 'freelancer'],
  },
  pipelines: {
    projects: ['pipeline-dados-databricks', 'transcricao-whisper', 'record'],
    experience: ['record', 'eldorado', 'freelancer'],
  },
  cloud: {
    projects: ['cafe-com-bpo', 'placo', 'record', 'transcricao-whisper'],
    experience: ['freelancer', 'record', 'eldorado'],
  },
  quality: {
    projects: ['cafe-com-bpo', 'placo'],
    experience: ['eldorado', 'record'],
  },
  ai: {
    projects: ['transcricao-whisper', 'cafe-com-bpo', 'placo', 'sindico-indica'],
    experience: ['freelancer', 'record', 'eldorado'],
  },
  methodologies: {
    projects: [
      'cafe-com-bpo',
      'placo',
      'sindico-indica',
      'nacao-patina',
      'pipeline-dados-databricks',
      'transcricao-whisper',
    ],
    experience: ['freelancer', 'record', 'eldorado', 'gp'],
  },
};
