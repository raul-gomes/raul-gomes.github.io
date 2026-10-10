import type { Experience } from './types';

export const experience: Experience[] = [
  {
    id: 'record',
    company: 'Record Brasília',
    role: {
      pt: 'Analista de Desenvolvimento de Sistemas',
      en: 'Systems Development Analyst',
    },
    period: 'Mai/2025 – Set/2025',
    summary: {
      pt: 'APIs RESTful em Python (Django, FastAPI) e Node.js para múltiplos contextos de negócio; modelagem em PostgreSQL e MongoDB; frontend em React.',
      en: 'RESTful APIs in Python (Django, FastAPI) and Node.js across multiple business contexts; PostgreSQL and MongoDB modeling; React frontend.',
    },
  },
  {
    id: 'freelancer',
    company: 'Freelancer',
    role: {
      pt: 'Desenvolvedor Full Stack',
      en: 'Full Stack Developer',
    },
    period: 'Mar/2024 – Mai/2025',
    summary: {
      pt: 'APIs em Python com arquitetura limpa e SOLID; frontends em Angular; integrações via APIs, automação de workflows (Make, N8N) e deploy em cloud.',
      en: 'Python APIs with clean architecture and SOLID; Angular frontends; API integrations, workflow automation (Make, N8N) and cloud deploys.',
    },
  },
  {
    id: 'eldorado',
    company: 'Instituto de Pesquisa Eldorado',
    role: {
      pt: 'Analista de Software Pleno',
      en: 'Mid-level Software Analyst',
    },
    period: 'Mai/2022 – Mar/2024',
    summary: {
      pt: 'APIs Python (Flask), schemas Oracle com stored procedures, pipelines de observabilidade (OpenTelemetry + Grafana), microserviços e mentoria de juniores.',
      en: 'Python APIs (Flask), Oracle schemas with stored procedures, observability pipelines (OpenTelemetry + Grafana), microservices and mentoring juniors.',
    },
  },
  {
    id: 'gp',
    company: 'G&P Projetos e Sistemas S.A.',
    role: {
      pt: 'Programador de Software Júnior',
      en: 'Junior Software Developer',
    },
    period: 'Fev/2022 – Mai/2022',
    summary: {
      pt: 'APIs em .NET e linguagens tipadas; workflows low-code com Bizagi Studio; testes unitários e integração contínua.',
      en: 'APIs in .NET and typed languages; low-code workflows with Bizagi Studio; unit tests and continuous integration.',
    },
  },
];
