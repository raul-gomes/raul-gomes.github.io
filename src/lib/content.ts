import { getCollection } from 'astro:content';
import type { Locale } from '@data/types';

const imageUrls = import.meta.glob('../img/**/*.{png,jpg,jpeg,webp,avif,gif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function resolveImage(src: string): string {
  if (!src.startsWith('src/img/')) return src;
  const key = `../${src.slice('src/'.length)}`;
  return imageUrls[key] ?? src;
}

export interface GalleryImage {
  src: string;
  caption?: string;
}

export interface ContentLink {
  label: string;
  href: string;
}

export type ContentStatus = 'live' | 'wip' | 'placeholder';

export interface SectionView {
  slug: string;
  title: string;
  tagline?: string;
  bodyHtml: string;
  icon: string;
  order: number;
  status?: ContentStatus;
  tags: string[];
  links: ContentLink[];
  cover?: string;
  gallery: GalleryImage[];
  company?: string;
  period?: string;
  kind?: string;
}

interface EntryLike {
  id: string;
  data: Record<string, unknown>;
  rendered?: { html: string };
}

function slugOf(id: string): string {
  const index = id.lastIndexOf('.');
  return index === -1 ? id : id.slice(0, index);
}

function toView(entry: EntryLike): SectionView {
  const data = entry.data;
  return {
    slug: slugOf(entry.id),
    title: String(data.title ?? ''),
    tagline: data.tagline ? String(data.tagline) : undefined,
    bodyHtml: entry.rendered?.html ?? '',
    icon: data.icon ? String(data.icon) : 'folder',
    order: typeof data.order === 'number' ? data.order : 0,
    status: data.status as ContentStatus | undefined,
    tags: Array.isArray(data.stack) ? (data.stack as string[]) : [],
    links: Array.isArray(data.links) ? (data.links as ContentLink[]) : [],
    cover: data.cover ? resolveImage(String(data.cover)) : undefined,
    gallery: Array.isArray(data.gallery)
      ? (data.gallery as GalleryImage[]).map((image) => ({ ...image, src: resolveImage(image.src) }))
      : [],
    company: data.company ? String(data.company) : undefined,
    period: data.period ? String(data.period) : undefined,
    kind: data.kind ? String(data.kind) : undefined,
  };
}

async function collect(collection: 'projects' | 'experience' | 'pages', locale: Locale): Promise<SectionView[]> {
  const entries = (await getCollection(
    collection as 'projects',
    (entry) => (entry.data as { lang?: string }).lang === locale,
  )) as unknown as EntryLike[];
  return entries.map(toView).sort((a, b) => a.order - b.order);
}

export function getProjects(locale: Locale): Promise<SectionView[]> {
  return collect('projects', locale);
}

export function getExperience(locale: Locale): Promise<SectionView[]> {
  return collect('experience', locale);
}

export async function getPage(kind: 'about' | 'skills' | 'education' | 'contact', locale: Locale): Promise<SectionView | undefined> {
  const entries = (await getCollection(
    'pages',
    (entry) => (entry.data as { lang?: string }).lang === locale && (entry.data as { kind?: string }).kind === kind,
  )) as unknown as EntryLike[];
  return entries.map(toView)[0];
}
