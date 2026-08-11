# Schoolo

A responsive web application for discovering, filtering, and shortlisting schools in Saudi Arabia, built for parents.

## Overview

Schoolo helps parents in Riyadh, Jeddah, and Dammam browse a catalog of private and international schools, filter them by curriculum, budget, distance, and special-needs support, and shortlist the ones that fit their family. Each school has a detail page with fee breakdowns, facilities, accreditation, and parent reviews, plus the ability to book a visit or placement test. A rule-based chat assistant, an alerts feed, and a family profile round out the experience.

This is the web conversion of an earlier Schoolo mobile app (Expo/React Native), which still exists in this repository at `artifacts/schoolo/` but is not the focus of this README.

## Key Features

- **School discovery & filtering** — filter by city, curriculum, budget, distance, and special-needs support, with a per-school "fit score" computed against the user's saved preferences (`src/data/schools.ts`)
- **Search & sort** — search by name/city/curriculum and sort results (featured, price, rating)
- **School detail pages** — fees breakdown, facilities, extracurriculars, accreditation, and a review summary
- **Favorites** — save schools for later, persisted in the browser
- **Booking** — schedule a school visit or placement test, which generates a confirmation alert
- **Chat "AI Advisor"** — answers keyword-matched questions about budget, curriculum, location, special-needs support, and sibling discounts (`src/pages/chat.tsx`); this is rule-based logic, not a connected LLM
- **Alerts** — deadlines, open days, fee updates, and booking notifications
- **Guided onboarding** — a short multi-step flow that confirms location, curriculum, and budget preferences
- **Profile & settings** — family and children information, preferences, and app language (English/Arabic, with RTL layout support)
- **Light/dark theme** — implemented via `next-themes` and a `.dark` token block in `src/index.css`
- **Responsive layout** — sidebar navigation on larger screens, bottom tab bar on mobile (`AppShell`)

## Application Experience

Login/Signup (with a guest option) → Onboarding → Home (search, filter, sort schools) → School Detail (fees, facilities, reviews, book a visit) → Favorites → Chat Advisor → Alerts → Profile

## Technical Highlights

- Component architecture built on a shared **shadcn/ui** (Radix UI primitives) component library under `src/components/ui`
- App-wide state managed with a single React Context (`AppContext`) persisted to `localStorage` — no server session
- Client-side routing with **Wouter** (not React Router)
- Form validation with **react-hook-form** + **Zod** (see `signup.tsx`)
- TanStack React Query is installed and wired into `App.tsx`, but there are no network requests in the codebase — it is not currently used against any API
- Tailwind CSS v4 with a token-based theme driving both light and dark mode
- A route-level error boundary wraps the page views

## Tech Stack

React 19, TypeScript, Vite 7, Tailwind CSS v4, shadcn/ui (Radix UI primitives), Wouter, next-themes, react-hook-form, Zod, TanStack React Query, Framer Motion

## Project Status

This app is a front-end prototype, not a production backend-connected system:

- **Fully client-side** — there are no `fetch`/`axios`/API calls anywhere in `src/`. Everything runs in the browser.
- **Login and signup are simulated** — form submission uses a timed delay and writes to local state; there is no real authentication or server session.
- **School and review data is static** — `src/data/schools.ts` and `src/data/reviews.ts` are hardcoded TypeScript datasets, not results from a live database.
- **The chat advisor is rule-based** — it matches keywords in the user's message to canned, data-driven responses. It is not connected to an LLM provider.
- **Bookings and alerts are local only** — they are simulated and persisted to `localStorage`, not a server.

For context: this repository also contains a larger Replit-managed pnpm workspace (`artifacts/`, `lib/`) with a real Express + Drizzle/PostgreSQL API server (`artifacts/api-server`, `lib/db`) and an integrated copy of this web app (`artifacts/skoolu-web`) wired to that backend. `schoolo-web/`, documented here, is the standalone static export of that app prepared for independent deployment, and it does not call that backend.

## Getting Started

```bash
cd schoolo-web
npm install

npm run dev        # start the dev server (http://localhost:5173)
npm run typecheck   # TypeScript check
npm run lint         # ESLint
npm run build        # production build to dist/
npm run preview      # preview the production build
```

No environment variables are required — the app is fully static.

## Author

Leen Kharraz
Software Engineering
