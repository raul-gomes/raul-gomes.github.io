import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lang = z.enum(['pt', 'en']);

const generateId = ({ entry }: { entry: string }): string => entry.replace(/\.mdx?$/, '');

const image = z.object({
  src: z.string(),
  caption: z.string().optional(),
});

const link = z.object({
  label: z.string(),
  href: z.string(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects', generateId }),
  schema: z.object({
    lang,
    title: z.string(),
    tagline: z.string(),
    status: z.enum(['live', 'wip', 'placeholder']),
    stack: z.array(z.string()).default([]),
    icon: z.string().default('folder'),
    order: z.number().default(0),
    links: z.array(link).default([]),
    cover: z.string().optional(),
    gallery: z.array(image).default([]),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience', generateId }),
  schema: z.object({
    lang,
    title: z.string(),
    company: z.string(),
    period: z.string(),
    icon: z.string().default('folder'),
    order: z.number().default(0),
    gallery: z.array(image).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages', generateId }),
  schema: z.object({
    lang,
    kind: z.enum(['about', 'skills', 'education', 'contact']),
    title: z.string(),
    icon: z.string().default('folder'),
    order: z.number().default(0),
  }),
});

export const collections = { projects, experience, pages };
