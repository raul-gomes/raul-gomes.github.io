import type { StackGroup } from './types';

export const stack: StackGroup[] = [
  {
    id: 'backend',
    label: { pt: 'Backend', en: 'Backend' },
    items: ['Python', 'Django', 'FastAPI', 'Flask', 'Node.js', 'Express.js', 'REST', 'GraphQL (conceitual)'],
  },
  {
    id: 'frontend',
    label: { pt: 'Frontend', en: 'Frontend' },
    items: ['JavaScript', 'React', 'Angular', 'D3.js'],
  },
  {
    id: 'data',
    label: { pt: 'Dados', en: 'Data' },
    items: ['PostgreSQL', 'MongoDB', 'Oracle DB', 'Redis', 'Databricks', 'SQL', 'Modelagem de dados'],
  },
  {
    id: 'cloud',
    label: { pt: 'Cloud & DevOps', en: 'Cloud & DevOps' },
    items: ['Azure', 'Docker', 'Kubernetes (conceitual)', 'CI/CD', 'GitHub Actions', 'GitLab', 'IaC'],
  },
  {
    id: 'tools',
    label: { pt: 'Ferramentas & Práticas', en: 'Tools & Practices' },
    items: ['Git', 'OpenTelemetry', 'Grafana', 'Postman', 'DBeaver', 'Make', 'N8N', 'SOLID', 'Scrum'],
  },
];
