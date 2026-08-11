# Schoolo Web

A responsive React/Vite web application for discovering and comparing schools in Saudi Arabia. This is the web conversion of the original **Schoolo** mobile application.

## Features

- 🏫 **School Discovery** — Browse and filter 15 schools across Saudi Arabia
- 🔍 **Smart Search** — Search by name, city, curriculum, or facilities
- ❤️ **Favorites** — Save schools for later comparison
- 📅 **Bookings** — Schedule visits and placement tests
- 💬 **AI Advisor** — Get personalised school recommendations
- 🔔 **Alerts** — Track application deadlines and updates
- 👤 **Profile** — Manage your family preferences and settings
- 🌙 **Dark Mode** — Full light/dark theme support
- 📱 **Fully Responsive** — Mobile, tablet, laptop, and desktop layouts

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS v4** — styling
- **shadcn/ui** — component library (Radix UI primitives)
- **Wouter** — client-side routing
- **next-themes** — dark/light mode
- **react-hook-form** + **Zod** — form validation
- **Framer Motion** — animations

## Project Structure

```
schoolo-web/
├── public/             # Static assets (school images, logos, favicon)
├── src/
│   ├── components/
│   │   ├── layout/     # AppShell — responsive sidebar + bottom tabs
│   │   └── ui/         # shadcn/ui components
│   ├── context/        # AppContext — global state (localStorage)
│   ├── data/           # Static school, review, and image data
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── pages/          # Route pages
├── vercel.json         # SPA routing for Vercel
├── vite.config.ts
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Install

```bash
cd schoolo-web
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Type Check

```bash
npm run typecheck
```

### Lint

```bash
npm run lint
```

### Production Build

```bash
npm run build
```

Output is in `dist/`. Preview with:

```bash
npm run preview
```

## Deployment

### Vercel (Recommended)

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project**.
3. Import your GitHub repository.
4. Set **Root Directory** to `schoolo-web`.
5. Framework preset: **Vite**.
6. Click **Deploy**.

The `vercel.json` file handles SPA routing so deep links like `/favorites` and `/schools/:id` work correctly after refresh.

### Environment Variables

This project is fully static — no environment variables are required for deployment.

## Data

All school data is stored as static TypeScript in `src/data/`. The app persists user preferences, favorites, and bookings in `localStorage`. No backend or database is required.

## Project Locations

| Version | Location |
|---|---|
| Original Schoolo mobile app | `artifacts/schoolo/` (Expo/React Native) |
| Schoolo responsive web app | `schoolo-web/` (React/Vite) |
