import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const getStaticPaths = (async () => {
  const entries = await getCollection('projects');
  const titles = new Map<string, string>();
  for (const entry of entries) {
    const slug = entry.id.slice(0, entry.id.lastIndexOf('.'));
    if (!titles.has(slug) || entry.data.lang === 'pt') titles.set(slug, entry.data.title);
  }
  return [...titles.entries()].flatMap(([id, title]) =>
    [0, 1, 2, 3].map((i) => ({ params: { id, index: String(i) }, props: { title, index: i } })),
  );
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { title, index } = props as { title: string; index: number };
  const label = index === 0 ? 'COVER' : `SHOT ${String(index).padStart(2, '0')}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" role="img" aria-label="${escapeXml(title)} — ${label}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f380f"/>
      <stop offset="0.5" stop-color="#008080"/>
      <stop offset="1" stop-color="#101015"/>
    </linearGradient>
    <pattern id="p" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="transparent"/>
      <rect width="8" height="1" fill="rgba(255,255,255,0.05)"/>
    </pattern>
  </defs>
  <rect width="640" height="400" fill="url(#g)"/>
  <rect width="640" height="400" fill="url(#p)"/>
  <rect x="16" y="16" width="608" height="368" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/>
  <text x="40" y="60" fill="#e8f5e9" font-family="monospace" font-size="26" font-weight="700">${escapeXml(title)}</text>
  <text x="40" y="92" fill="#9ccc9c" font-family="monospace" font-size="14">${label} · placeholder</text>
  <text x="40" y="360" fill="#7fbf7f" font-family="monospace" font-size="12">substitua por uma imagem real em /public/</text>
</svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
