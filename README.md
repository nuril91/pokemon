# Pokedex (React + Vite + TypeScript)

A responsive Pokedex web app that lists Pokemon and shows details (About, Base Stats, Evolution) powered by the public **PokeAPI**.  
The app focuses on clean architecture, fast UX (prefetch + caching), and accessibility.

> **Live Demo:** https://pokemon-kappa-two-93.vercel.app

---

## ✨ Features

- **Home / List**
  - Grid of Pokemon cards with official artwork.
  - **Search by name** (state stored in URL via `?q=`).
  - **Infinite scroll** using `IntersectionObserver` (no “Load more” click needed).
  - **Lazy detail fetching**: a card fetches its detail (types) only when it enters the viewport → fewer requests, avoids rate limits.

- **Detail `/pokemon/:name`**
  - Hero header with **type-based dynamic gradient**.
  - **Tabs**: About / Base Stats (bar chart) / Evolution.
  - Evolution chips use **`NavLink`** so the active evolution is highlighted.
  - **Prefetch** of detail + species on hover/viewport for snappy navigation.

- **Reliability**
  - Response validation with **Zod**.
  - **ErrorBoundary** with friendly fallback UI.
  - Explicit loading & error states.

- **Responsiveness**
  - Tabs use proper semantics: `tablist`, `tab`, `tabpanel`.
  - Focus rings, alt text, keyboard-friendly.
  - Mobile-first layout, great on tablet & desktop.

---

## 🧰 Tech Stack

- **Vite + React + TypeScript**
- **React Router** for routing
- **TanStack Query** for fetching, caching, and prefetching
- **Tailwind CSS** (v3) for styling
- **Zod** for schema/validation
- **Recharts** for Base Stats chart
- **clsx** for conditional class names

---

## 🚀 Getting Started

### Prerequisites
- Node.js **18+** (20+ recommended)
- npm

### Install & Run
```bash
npm install
npm run dev     # http://localhost:5173
