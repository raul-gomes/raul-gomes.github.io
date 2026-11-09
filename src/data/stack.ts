import type { StackGroup } from './types';

export const stack: StackGroup[] = [
  {
    id: 'languages',
    label: { pt: 'Linguagens', en: 'Languages' },
    items: {
      pt: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'R'],
      en: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'R'],
    },
  },
  {
    id: 'backend',
    label: { pt: 'Backend & APIs', en: 'Backend & APIs' },
    items: {
      pt: ['FastAPI', 'Django', 'Flask', 'Node.js (Express)', 'APIs RESTful', 'Pydantic', 'SQLAlchemy', 'Alembic', 'OAuth', 'JWT'],
      en: ['FastAPI', 'Django', 'Flask', 'Node.js (Express)', 'RESTful APIs', 'Pydantic', 'SQLAlchemy', 'Alembic', 'OAuth', 'JWT'],
    },
  },
  {
    id: 'frontend',
    label: { pt: 'Frontend', en: 'Frontend' },
    items: {
      pt: ['React', 'Angular', 'Vite', 'TanStack Query', 'React Hook Form', 'Zod'],
      en: ['React', 'Angular', 'Vite', 'TanStack Query', 'React Hook Form', 'Zod'],
    },
  },
  {
    id: 'data',
    label: { pt: 'Bancos de dados', en: 'Databases' },
    items: {
      pt: ['PostgreSQL', 'MongoDB', 'Oracle DB', 'Modelagem relacional e não relacional', 'Stored procedures', 'Otimização de queries'],
      en: ['PostgreSQL', 'MongoDB', 'Oracle DB', 'Relational & non-relational modeling', 'Stored procedures', 'Query optimization'],
    },
  },
  {
    id: 'pipelines',
    label: { pt: 'Dados', en: 'Data' },
    items: {
      pt: ['Pipelines ETL/ELT', 'Databricks', 'Arquitetura medalhão (bronze/silver/gold)', 'Data Lakes'],
      en: ['ETL/ELT pipelines', 'Databricks', 'Medallion architecture (bronze/silver/gold)', 'Data Lakes'],
    },
  },
  {
    id: 'cloud',
    label: { pt: 'Cloud & DevOps', en: 'Cloud & DevOps' },
    items: {
      pt: ['Azure', 'OCI', 'AWS', 'Docker', 'Nginx', 'CI/CD', 'Git'],
      en: ['Azure', 'OCI', 'AWS', 'Docker', 'Nginx', 'CI/CD', 'Git'],
    },
  },
  {
    id: 'quality',
    label: { pt: 'Qualidade & observabilidade', en: 'Quality & observability' },
    items: {
      pt: ['pytest', 'Vitest', 'React Testing Library', 'Grafana', 'OpenTelemetry', 'API Gateway'],
      en: ['pytest', 'Vitest', 'React Testing Library', 'Grafana', 'OpenTelemetry', 'API Gateway'],
    },
  },
  {
    id: 'ai',
    label: { pt: 'IA & automação', en: 'AI & automation' },
    items: {
      pt: ['GitHub Copilot', 'Claude', 'OpenAI Whisper', 'n8n', 'Make'],
      en: ['GitHub Copilot', 'Claude', 'OpenAI Whisper', 'n8n', 'Make'],
    },
  },
  {
    id: 'methodologies',
    label: { pt: 'Metodologias', en: 'Methodologies' },
    items: {
      pt: ['Agile/Scrum', 'Levantamento de requisitos', 'Documentação de arquitetura'],
      en: ['Agile/Scrum', 'Requirements gathering', 'Architecture documentation'],
    },
  },
];
