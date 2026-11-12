---
lang: en
title: Síndico Indica
tagline: An app where building managers recommend and find trusted service providers
status: wip
stack: [Expo, React Native, TypeScript, Supabase, PostgreSQL, PostGIS, Next.js, Jest, pgTAP, EAS]
icon: magnifier
order: 4
links:
  - { label: code, href: 'https://github.com/raul-gomes' }
  # Reserved: uncomment once the app is published on the Play Store.
  # - { label: Play Store, href: 'https://play.google.com/store/apps/details?id=com.sindicoindica.myapp' }
cover: /projects/sindico-indica/00-logo.webp
gallery:
  - { src: /projects/sindico-indica/01-home.webp, caption: Home with the best rated providers, rating and distance }
  - { src: /projects/sindico-indica/02-categoria.webp, caption: A category sorted by rating and, on ties, by distance to the building }
  - { src: /projects/sindico-indica/03-prestador.webp, caption: Provider profile with reviews and direct contact }
  - { src: /projects/sindico-indica/04-recomendar.webp, caption: When recommending, a phone already on file shows the existing profile }
  - { src: /projects/sindico-indica/05-avaliar.webp, caption: Review with stars, a comment and "would hire again" }
  - { src: /projects/sindico-indica/06-meu-perfil.webp, caption: Providers manage their own page }
---

An app for building managers (síndicos) to find service providers recommended by other building managers: search by category, rating and distance to the building, reviews with "would hire again", direct WhatsApp contact and a profile that providers manage themselves.

It was my first mobile app.

## The context

Building managers recommend providers to each other all the time, but those recommendations were scattered across group chats. Síndico Indica organizes them in an app: the base started from the contacts that building managers in Brasília were already sharing, normalized into one record per phone number (more than 2,200 providers), and grows with every recommendation and review.

## What the app does

- **Search:** by category or by text (name, company, specialty and comments), sorted by rating and, on ties, by the provider closest to the building
- **Reviews:** stars, a comment and "would hire again"; providers reply
- **Recommend:** add a new provider with state and city from IBGE (the Brazilian statistics office); if the phone already exists, the app shows the profile
- **Favorites** and a top 10 of the best rated
- **Provider profile:** providers create or claim their own profile, edit it, reply to comments and can leave the app
- **Account:** sign-up as a building manager (building and term of office) or as a provider, password recovery and account deletion
- **Admin panel:** building manager verification and moderation

## Stack

| Layer | Technology |
| --- | --- |
| App | Expo SDK 57, React Native 0.86, TypeScript, Expo Router |
| Database and auth | Supabase: PostgreSQL + PostGIS, Auth, Storage, Edge Functions |
| Panel | Next.js 16, React 19 |
| Notifications and billing | Expo Notifications; RevenueCat (ready, turned off) |
| Quality | Jest, React Native Testing Library, Vitest, pgTAP, GitHub Actions |
| Build | EAS Build (APK and App Bundle) |

## Technical decisions

The database does the heavy lifting. Each category list and the search come from a single PostgreSQL function that filters, searches ignoring accents, sorts by rating and by distance to the building (PostGIS) and returns 20 at a time: about 5 KB per page, in a few milliseconds. The app only draws.

Phone numbers are compared by their digits inside the database, with the same rule as the unique index: a number saved with a mask cannot slip through, and whoever recommends sees the existing provider right away.

One account can be both a building manager and a provider: the manager creates or claims the provider profile that already exists with their phone number, and the database prevents anyone from reviewing their own profile.

## Performance

A measured analysis after the first release found problems the tests did not show: the brand font had never loaded (the files were an error page), the bundle shipped 24 icon fonts to use one, the whole app was unmounted on every login refresh and push registration ran on every screen change. With those fixed, image and font files dropped from **5.5 MB to 1.7 MB**, and each category list now comes from the database in pages of 20.

## Security and privacy (LGPD)

Row Level Security on all 12 tables, the user's role protected in the database, real account deletion (personal data and documents erased; reviews stay anonymous) and server functions that only accept the service key. Secret keys stay out of the app and the repository, and continuous integration blocks any that shows up in the code.

## Tests and quality

| Layer | What is covered |
| --- | --- |
| App (Jest) | **654 tests, 99.2% of lines**: screens, sign-up, search and pagination, login and notifications |
| Panel (Vitest) | **83 tests, 100% of lines** |
| Database (pgTAP) | **36 tests**: search, ordering, pagination, access rules and account deletion |

Before each release, a visual audit runs the app in the browser against a local database and captures every screen. That is how mixed fonts, misaligned fields and outdated texts showed up.

## What I learned

- **Measure before optimizing:** the biggest losses only showed up by exporting the bundle and reading the source map.
- **Let the database work:** filtering, search, ordering and pagination in PostgreSQL keep the app simple and the result correct.
- **Access rules in the database, tested in the database**, with Row Level Security and pgTAP.
- **Badly wired React effects and context are expensive:** network, battery and lost state.
- **Secrets do not go in the app:** everything public at build time ends up inside the bundle; secret keys live on the server.
- **Regression test first:** every production bug became a test before the fix.
- **See the real app:** a visual audit in the browser found what the tests did not.

## Next steps

- Publishing on the Play Store (privacy policy and account deletion page)
- Turning on subscriptions when the user base justifies it
