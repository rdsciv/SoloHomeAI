# Solo Home AI

**solohome.ai** — The sovereign, open-source AI property manager.  
Quiet luxury meets local open-weight AI.

This repo is a **React (Vite + TypeScript)** port of the Open Design prototypes for Solo Home AI. Visual design, layout, interactions, and copy are preserved from the original single-file HTML prototypes.

## Stack

| Layer | Choice |
|-------|--------|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Routing | React Router 7 |
| Charts | Apache ECharts (Operations panel) |
| Design | Tokens & CSS from Open Design `DESIGN.md` |

There is **no stack conflict**: the Open Design source was static HTML/CSS/JS. This React app is the runnable product shell.

## Routes

Uses **HashRouter** so deep links work on static hosts (Vercel/GitHub Pages) without server rewrite issues.

| Path | Surface |
|------|---------|
| `/#/` | Marketing landing |
| `/#/app` | Homeowner dashboard (Overview, Manager, Zones, Devices, HA Bridge, Permissions, Operations) |
| `/#/app?panel=operations` | Dashboard → Operations charts |
| `/#/system-map` | Architecture + home topology diagram |

Original HTML prototypes (reference only) live under `public/prototypes/`.

## Run

```bash
cd /Users/chilly/Projects/grok/solohomeai
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

## Preview (production build)

```bash
npm run build
npm run preview
```

## Verify

```bash
# Typecheck + production build
npm run build

# Optional: typecheck only
npx tsc -b --pretty false
```

Manual UI checks:

1. **Landing** (`/`) — theme toggle, sticky header, mobile menu, CTAs to `/app` and `/system-map`
2. **Dashboard** (`/app`) — rail navigation across all panels; device filters; permission segments; chat composer demos; **Operations** charts (ECharts)
3. **System map** (`/system-map`) — node selection inspector, topology zones/devices, theme toggle

## Design system

See [`DESIGN.md`](./DESIGN.md) for brand tokens, typography, components, voice, and HA integration surface notes.

## Project layout

```
src/
  pages/           Landing, Dashboard, System Map
  styles/          Extracted prototype CSS (landing, dashboard, system-map)
  hooks/useTheme   Shared dark/light theme (localStorage)
  lib/             Dashboard & system-map interaction controllers
public/prototypes/ Original Open Design HTML (reference)
DESIGN.md          Design system source of truth
```
