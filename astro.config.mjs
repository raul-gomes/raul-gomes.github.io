// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // GitHub Pages do usuário (raul-gomes.github.io). Se o repositório for
  // de projeto (ex.: raul-gomes/portfolio), troque `site` e defina `base: '/portfolio/'`.
  site: 'https://raul-gomes.github.io',
  base: '/',
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    resolve: {
      alias: {
        '@data': new URL('./src/data', import.meta.url).pathname,
        '@components': new URL('./src/components', import.meta.url).pathname,
        '@layouts': new URL('./src/layouts', import.meta.url).pathname,
        '@styles': new URL('./src/styles', import.meta.url).pathname,
        '@scripts': new URL('./src/scripts', import.meta.url).pathname,
        '@lib': new URL('./src/lib', import.meta.url).pathname,
      },
    },
  },
});
