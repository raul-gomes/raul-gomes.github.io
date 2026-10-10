import type { Project } from './types';

export const projects: Project[] = [
  {
    id: 'cafe-com-bpo',
    title: 'Café com BPO',
    tagline: {
      pt: 'Plataforma de BPO financeiro',
      en: 'Financial BPO platform',
    },
    readme: {
      pt: 'Plataforma para gestão de operações de BPO financeiro. Centraliza contas a pagar e a receber, conciliação e relatórios operacionais num fluxo único, com autenticação por papéis e trilha de auditoria das movimentações.',
      en: 'A platform for managing financial BPO operations. It centralizes accounts payable and receivable, reconciliation and operational reports in a single flow, with role-based access and an audit trail of every movement.',
    },
    stack: ['FastAPI', 'PostgreSQL', 'React', 'Docker', 'CI/CD'],
    status: 'live',
    links: { repo: 'https://github.com/raul-gomes' },
  },
  {
    id: 'placo',
    title: 'Placo',
    tagline: {
      pt: 'Sistema de gestão financeira',
      en: 'Financial management system',
    },
    readme: {
      pt: 'Sistema de gestão financeira pessoal com limite de gastos, categorização e alertas. Backend RESTful com autenticação e validação, modelagem normalizada em PostgreSQL e frontend reativo com estado centralizado.',
      en: 'A personal finance management system with spending limits, categorization and alerts. RESTful backend with authentication and validation, normalized PostgreSQL modeling and a reactive frontend with centralized state.',
    },
    stack: ['FastAPI', 'React', 'PostgreSQL', 'Docker Compose', 'OpenAPI'],
    status: 'live',
    links: { repo: 'https://github.com/raul-gomes' },
  },
  {
    id: 'nacao-patina',
    title: 'Nação Patina',
    tagline: {
      pt: 'Rede social de um grupo de patinação',
      en: 'Social network for a skating group',
    },
    readme: {
      pt: 'Rede social para uma comunidade de patinação: perfil de atletas, feed de rolês, encontros e mídia. Comunicação via API, upload de imagens e uma experiência pensada para uso no celular durante os eventos.',
      en: 'A social network for a skating community: athlete profiles, ride feed, meetups and media. API communication, image uploads and an experience designed for mobile use during events.',
    },
    stack: ['Node.js', 'React', 'MongoDB', 'REST', 'Docker'],
    status: 'wip',
    links: { repo: 'https://github.com/raul-gomes' },
  },
  {
    id: 'gerador-legenda',
    title: 'Gerador de Legenda',
    tagline: {
      pt: 'Placeholder — a definir',
      en: 'Placeholder — to be defined',
    },
    readme: {
      pt: 'Espaço reservado para o projeto. Descrição, stack e links serão preenchidos com a informação real.',
      en: 'Reserved slot for the project. Description, stack and links will be filled with real information.',
    },
    stack: ['TBD'],
    status: 'placeholder',
  },
];
