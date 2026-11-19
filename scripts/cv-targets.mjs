/**
 * CV pages built by Astro and the PDF each one is printed to (paths relative to dist/).
 * Must match `profile.cvPath` in src/data/profile.ts (checked by src/lib/cv-targets.test.ts).
 */
export const CV_TARGETS = [
  { locale: 'pt', page: 'cv/index.html', pdf: 'cv/Raul_SGomes_CV-pt.pdf' },
  { locale: 'en', page: 'en/cv/index.html', pdf: 'cv/Raul_SGomes_CV-en.pdf' },
];
