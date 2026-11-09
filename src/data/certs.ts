import type { Award } from './types';

export const awards: Award[] = [
  {
    id: 'innovation-challenge',
    title: {
      pt: '3º lugar — Innovation Challenge Microsoft (cloud computing e IA)',
      en: '3rd place — Microsoft Innovation Challenge (cloud computing and AI)',
    },
    issuer: 'Microsoft',
    year: 2025,
  },
];

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: number;
}

export const certifications: Certification[] = [
  { id: 'databricks', name: 'Databricks Foundations', issuer: 'Databricks', year: 2026 },
  { id: 'azure-ai', name: 'Azure AI Engineer Associate', issuer: 'Microsoft', year: 2024 },
  { id: 'azure-fundamentals', name: 'Azure Fundamentals', issuer: 'Microsoft', year: 2024 },
  { id: 'scrum', name: 'Scrum Foundation', issuer: 'Scrum.org', year: 2023 },
  { id: 'itil', name: 'ITIL Foundation Certificate in IT Service Management', issuer: 'AXELOS', year: 2022 },
];
