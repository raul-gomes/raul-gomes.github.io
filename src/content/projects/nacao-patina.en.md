---
lang: en
title: Nação Patina
tagline: A free social network that teaches skating to people of all ages
status: live
stack: [Next.js 16, React 19, TypeScript, Supabase, PostgreSQL, Cloudflare R2, Tailwind CSS, Vitest, pgTAP, Docker]
icon: mushroom
order: 3
links:
  - { label: site, href: 'https://nacaopatina.vercel.app' }
  - { label: code, href: 'https://github.com/raul-gomes' }
cover: /projects/nacao-patina/00-logo.webp
gallery:
  - { src: /projects/nacao-patina/02-feed.webp, caption: Feed with teacher notices and the month's calendar }
  - { src: /projects/nacao-patina/10-chat.webp, caption: Real-time floating chat opened from a profile }
  - { src: /projects/nacao-patina/05-comunidade.webp, caption: Community wall and members }
  - { src: /projects/nacao-patina/06-agenda.webp, caption: Lessons and rides calendar with RSVP }
  - { src: /projects/nacao-patina/07-desapego.webp, caption: Nação Desapego, the members' marketplace }
  - { src: /projects/nacao-patina/11-gerenciar.webp, caption: The teacher grants and revokes moderators }
  - { src: /projects/nacao-patina/12-mobile-feed.webp, caption: Mobile layout with bottom navigation }
---

A free social network for a skating community, built to teach people of all ages how to skate: a feed with teacher notices, communities, a lessons and rides calendar, video lessons, a members' marketplace, real-time chat and notifications.

## The story

My client, a skating teacher, wanted his project to grow, but the whole community lived inside WhatsApp. Lesson notices, attendance, second-hand skates, students' questions: everything went through him, and it ate the time he should have spent thinking about how to grow the project.

The answer was to move the community out of WhatsApp and give it a home of its own: a social network where the teacher posts a notice once and everyone gets it, students confirm attendance on their own, used gear changes hands without a middleman and conversations happen in a built-in chat. The teacher gets time back for strategy; the community gets an organized place. The project is free for students.

## What the platform does

- **Feed and wall:** posts with up to 5 photos, mentions, likes and comments; Wall, Feed and Events tabs with unread counters; public notes on each member's profile, with forum-style replies
- **Teacher notices:** normal or urgent, pinned at the top of the feed
- **Communities:** groups with their own wall, visible only to members
- **Calendar:** lessons and rides with capacity, RSVP and a monthly calendar
- **Video lessons:** YouTube playlists organized by the teacher
- **Nação Desapego:** a gear marketplace with direct contact through the chat
- **Chat and notifications:** a floating 1:1 chat on every page, with an unread counter
- **Three roles:** student, moderator and teacher; the teacher picks the moderators

## Stack

| Layer | Technology |
| --- | --- |
| Front end | Next.js 16 (App Router, Server Components, Server Actions), React 19, TypeScript |
| UI | Tailwind CSS v4, shadcn/ui, own design system (`Patina*`) |
| Database and auth | Supabase: PostgreSQL, Auth, Realtime and Storage |
| Images | Cloudflare R2 (S3) and sharp |
| Quality | Vitest, React Testing Library, pgTAP, ESLint, strict TypeScript |
| Infra | Docker Compose for development, Vercel for the front end, versioned migrations with the Supabase CLI |

## Architecture

A modular monolith: 9 domain modules (identity, feed, notices, lessons, calendar, communities, marketplace, messaging, notifications). Each module ships its migration with the database access rules and its screens in the same PR, and is imported only through its public API. Boundaries stay clear without the cost of microservices.

Pages render their first data on the server and only ship JavaScript where there is interaction. Like, comment and attendance counts are computed in the database in a single query, with no N+1. The result was **49% less JavaScript per page** and pages of about 780 KB in total, down from 2 MB.

## Security in the database

Authorization lives in PostgreSQL, not in the UI: **Row Level Security on all 25 tables, with 80 policies**, 49 functions and 41 triggers. A member's role cannot be changed by the client (a trigger blocks it) and only the teacher grants moderator. An in-house audit fixed email enumeration, notification spam and the execution plan of the policies.

## Images: compression and safety

Every photo goes through a dedicated pipeline before it is published:

1. The browser checks type and size and uploads the file **straight to a private Cloudflare R2 bucket**, through a signed URL valid for 120 seconds. The file never passes through the app server.
2. The server downloads, **decodes and re-encodes** it with sharp: JPEG, PNG and WebP are accepted; SVG, animations and images above 40 megapixels are refused; orientation is applied and **EXIF and GPS data are stripped**.
3. The photo becomes **WebP at quality 80 with a longest side of up to 1600 px**, never upscaled. Avatars become a 256×256 WebP with a center crop, and the quality steps down until the file fits in 200 KB.
4. The final image gets a new key in a private bucket and is served through a **signed URL**, generated only for people allowed to see the post. The original is never kept.

A cleanup queue with a daily cron deletes replaced photos and photos from deleted posts. Per-member limits (uploads per hour and a 500 MB quota) are enforced atomically in the database.

## Real time with websockets

The chat uses **Supabase Realtime**, which pushes new messages over a websocket as soon as they are written to PostgreSQL. To avoid keeping a connection open per user all the time, the websocket is **on demand**: it opens when someone sends a message or keeps a conversation on screen, renews with each message and closes after 5 minutes of inactivity. The realtime client is only downloaded at that moment. The unread counter uses light polling (page change, tab focus and every 60 seconds while the tab is visible). The experience stays instant with a fraction of the connections.

## Tests and coverage

| Layer | What is covered |
| --- | --- |
| Front end (Vitest) | **1,021 tests, 99.2% of lines** (95.8% of branches). Screens tested with React Testing Library, Server Actions and services against a simulated Supabase, realtime hooks with a fake clock, every page checked per role (student, moderator, teacher). CI fails if coverage drops below 90%. |
| Database (pgTAP) | **139 tests in 13 suites**: each role's access rules, wall and member privacy, conversations, notifications, counts and media (ownership, limits and quota). |
| Static | ESLint and TypeScript with no errors; the build fails on a type error. |

Access rules are tested where they actually apply, in the database, and the interface is tested from the user's point of view: what each role sees, what each form sends and which message shows up when something goes wrong.

## Next steps

- Gamification (points and achievements)
