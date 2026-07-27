# Solo Home AI — Design System

**solohome.ai** · The Sovereign, Open-Source AI Property Manager  
*Quiet luxury meets local open-weight AI.*

---

## 1. Brand essence

| Attribute | Direction |
|-----------|-----------|
| **Promise** | Intelligent automation for high-end homes — without cloud lock-in |
| **Personality** | Premium, calm, trustworthy, privacy-first |
| **Reference mix** | Linear product precision + refined Apple Home + Monocle editorial restraint |
| **Avoid** | Generic AI purple gradients, neon cyberpunk, consumer smart-home gadget clutter, flashy motion |

**Positioning line**  
> Your home runs locally. Your data stays yours. Your agents act with permission.

**Audiences**
1. **Homeowners (HNW)** — want proactive intelligence without surrendering the house to a vendor cloud  
2. **General contractors (Seattle custom)** — specifying “robot-ready” packages for new construction  

---

## 2. Color system

Dark-mode first. All roles defined in **OKLCH** with hex fallbacks for tooling that needs them.

### 2.1 Core palette (dark — default)

| Token | Role | OKLCH | Hex fallback |
|-------|------|-------|--------------|
| `--color-bg` | App / page background | `oklch(0.145 0.008 250)` | `#12141a` |
| `--color-bg-elevated` | Subtle wash behind sections | `oklch(0.165 0.009 250)` | `#171a21` |
| `--color-surface` | Cards, panels, inputs | `oklch(0.195 0.010 250)` | `#1c2029` |
| `--color-surface-hover` | Hover / pressed surface | `oklch(0.225 0.011 250)` | `#242933` |
| `--color-border` | Default borders | `oklch(0.28 0.012 250)` | `#2e3440` |
| `--color-border-subtle` | Dividers, hairlines | `oklch(0.22 0.010 250)` | `#232833` |
| `--color-fg` | Primary text | `oklch(0.96 0.005 95)` | `#f4f3ef` |
| `--color-fg-secondary` | Secondary body | `oklch(0.78 0.012 95)` | `#c4c2ba` |
| `--color-fg-muted` | Captions, meta, placeholders | `oklch(0.58 0.014 250)` | `#858a96` |
| `--color-primary` | Primary actions, key links | `oklch(0.68 0.075 185)` | `#4a9e9a` |
| `--color-primary-hover` | Primary hover | `oklch(0.74 0.080 185)` | `#5bb5b0` |
| `--color-primary-muted` | Primary wash / focus rings | `oklch(0.68 0.075 185 / 0.14)` | `rgba(74,158,154,0.14)` |
| `--color-accent` | Emphasis, active nav, highlights | `oklch(0.62 0.070 165)` | `#3d8f7a` |
| `--color-accent-secondary` | Secondary accent (charts, tags) | `oklch(0.72 0.055 200)` | `#6aafb8` |
| `--color-success` | Online, allowed, healthy | `oklch(0.72 0.10 155)` | `#4caf82` |
| `--color-warning` | Attention, degraded | `oklch(0.82 0.12 85)` | `#d4a84b` |
| `--color-danger` | Critical, denied, offline-hard | `oklch(0.65 0.14 25)` | `#c96b5a` |
| `--color-info` | Informational callouts | `oklch(0.72 0.06 230)` | `#7a9bb8` |

**Accent usage rule:** Teal/forest is high-signal. Prefer thin rules, small fills on icons/pills, and CTA fills — never large gradient washes or neon glows.

### 2.2 Light variant

| Token | OKLCH | Hex fallback |
|-------|-------|--------------|
| `--color-bg` | `oklch(0.985 0.004 95)` | `#faf9f6` |
| `--color-bg-elevated` | `oklch(0.97 0.005 95)` | `#f4f2ed` |
| `--color-surface` | `oklch(1 0 0)` | `#ffffff` |
| `--color-surface-hover` | `oklch(0.96 0.006 95)` | `#f0eee8` |
| `--color-border` | `oklch(0.88 0.008 250)` | `#ddd9d0` |
| `--color-border-subtle` | `oklch(0.92 0.006 95)` | `#e8e5de` |
| `--color-fg` | `oklch(0.20 0.012 250)` | `#1a1d24` |
| `--color-fg-secondary` | `oklch(0.40 0.014 250)` | `#4a4f5a` |
| `--color-fg-muted` | `oklch(0.55 0.012 250)` | `#6e7380` |
| `--color-primary` | `oklch(0.52 0.085 185)` | `#2f7a76` |
| `--color-primary-hover` | `oklch(0.46 0.090 185)` | `#286864` |
| `--color-primary-muted` | `oklch(0.52 0.085 185 / 0.12)` | `rgba(47,122,118,0.12)` |
| `--color-accent` | `oklch(0.48 0.080 165)` | `#2d6f5e` |
| `--color-success` | `oklch(0.55 0.11 155)` | `#2d8a5e` |
| `--color-warning` | `oklch(0.70 0.13 85)` | `#b8892e` |
| `--color-danger` | `oklch(0.55 0.15 25)` | `#b05448` |

### 2.3 Semantic aliases

```css
--status-online: var(--color-success);
--status-local: var(--color-primary);
--status-offline: var(--color-fg-muted);
--status-permission-granted: var(--color-success);
--status-permission-ask: var(--color-warning);
--status-permission-deny: var(--color-danger);
```

### 2.4 CSS custom properties (copy block)

```css
:root, [data-theme="dark"] {
  color-scheme: dark;
  --color-bg: oklch(0.145 0.008 250);
  --color-bg-elevated: oklch(0.165 0.009 250);
  --color-surface: oklch(0.195 0.010 250);
  --color-surface-hover: oklch(0.225 0.011 250);
  --color-border: oklch(0.28 0.012 250);
  --color-border-subtle: oklch(0.22 0.010 250);
  --color-fg: oklch(0.96 0.005 95);
  --color-fg-secondary: oklch(0.78 0.012 95);
  --color-fg-muted: oklch(0.58 0.014 250);
  --color-primary: oklch(0.68 0.075 185);
  --color-primary-hover: oklch(0.74 0.080 185);
  --color-primary-muted: oklch(0.68 0.075 185 / 0.14);
  --color-accent: oklch(0.62 0.070 165);
  --color-accent-secondary: oklch(0.72 0.055 200);
  --color-success: oklch(0.72 0.10 155);
  --color-warning: oklch(0.82 0.12 85);
  --color-danger: oklch(0.65 0.14 25);
  --color-info: oklch(0.72 0.06 230);
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.24);
  --shadow-md: 0 8px 24px oklch(0 0 0 / 0.28);
}

[data-theme="light"] {
  color-scheme: light;
  --color-bg: oklch(0.985 0.004 95);
  --color-bg-elevated: oklch(0.97 0.005 95);
  --color-surface: oklch(1 0 0);
  --color-surface-hover: oklch(0.96 0.006 95);
  --color-border: oklch(0.88 0.008 250);
  --color-border-subtle: oklch(0.92 0.006 95);
  --color-fg: oklch(0.20 0.012 250);
  --color-fg-secondary: oklch(0.40 0.014 250);
  --color-fg-muted: oklch(0.55 0.012 250);
  --color-primary: oklch(0.52 0.085 185);
  --color-primary-hover: oklch(0.46 0.090 185);
  --color-primary-muted: oklch(0.52 0.085 185 / 0.12);
  --color-accent: oklch(0.48 0.080 165);
  --color-accent-secondary: oklch(0.58 0.055 200);
  --color-success: oklch(0.55 0.11 155);
  --color-warning: oklch(0.70 0.13 85);
  --color-danger: oklch(0.55 0.15 25);
  --color-info: oklch(0.52 0.07 230);
  --shadow-sm: 0 1px 2px oklch(0.30 0.02 250 / 0.06);
  --shadow-md: 0 8px 24px oklch(0.30 0.02 250 / 0.08);
}
```

---

## 3. Typography

### 3.1 Families

| Role | Recommendation | Fallback stack | Rationale |
|------|----------------|----------------|-----------|
| **Display / editorial** | **Newsreader** (400, 500, 600) | `Newsreader, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif` | Monocle-adjacent restraint; luxury without decoration |
| **UI / body** | **Inter** (400, 500, 600) | `Inter, system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif` | Linear-grade product clarity |
| **Mono / technical** | **JetBrains Mono** or **IBM Plex Mono** (400, 500) | `"JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace` | Permissions, model names, local paths, agent IDs |

Load via:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap" rel="stylesheet" />
```

### 3.2 Type scale (desktop)

| Token | Size | Line-height | Weight | Tracking | Use |
|-------|------|-------------|--------|----------|-----|
| `--text-display` | 48–56px / `clamp(2.25rem, 4vw, 3.5rem)` | 1.12 | 500 serif | −0.02em | Hero headlines |
| `--text-h1` | 36px / `2.25rem` | 1.2 | 500 serif | −0.015em | Section titles |
| `--text-h2` | 28px / `1.75rem` | 1.25 | 500 serif | −0.01em | Subsection |
| `--text-h3` | 20px / `1.25rem` | 1.35 | 600 sans | −0.01em | Card titles |
| `--text-body-lg` | 18px / `1.125rem` | 1.6 | 400 sans | 0 | Lead paragraphs |
| `--text-body` | 15–16px / `0.9375–1rem` | 1.55 | 400 sans | 0 | Default UI & body |
| `--text-sm` | 13–14px / `0.8125–0.875rem` | 1.45 | 400–500 sans | 0.01em | Meta, captions |
| `--text-xs` | 11–12px / `0.6875–0.75rem` | 1.4 | 500 sans | 0.04em | Labels, overlines (uppercase optional) |
| `--text-mono` | 12–13px | 1.4 | 400–500 mono | 0 | Status strings, model IDs |

**Rules**
- Section overlines: `text-xs`, uppercase, letter-spacing `0.08em`, color muted  
- Never set body below 14px on mobile for primary reading content  
- Prefer serif only for marketing display; product UI stays Inter  

---

## 4. Spacing, radius, elevation, motion

### 4.1 Spacing scale (8px baseline)

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |
| `--space-9` | 96px |
| `--space-10` | 128px |

**Layout defaults:** page gutter `clamp(1.25rem, 4vw, 2rem)`; section vertical rhythm `clamp(4rem, 10vw, 7.5rem)`; card padding `24px` (desktop) / `16–20px` (mobile).

### 4.2 Radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 6px | Inputs, pills, small controls |
| `--radius-md` | 8px | Buttons, cards, nav items |
| `--radius-lg` | 12px | Large panels, modals |
| `--radius-xl` | 16px | Hero media frames (rare) |
| `--radius-full` | 9999px | Status dots, avatar rings |

### 4.3 Borders & elevation

- Default border: `1px solid var(--color-border)`  
- Prefer border + subtle shadow over heavy drop shadows  
- Dark mode: shadows are soft black; light mode: barely-there charcoal  

### 4.4 Motion

| Token | Value |
|-------|-------|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--duration-fast` | 120ms |
| `--duration-base` | 200ms |
| `--duration-slow` | 320ms |

**Principles:** purposeful only — hover lift ≤1px, opacity/color transitions, no bounce, no infinite neon pulses. Respect `prefers-reduced-motion: reduce`.

---

## 5. Layout grid

- **Marketing:** max content width `1120–1200px`, centered  
- **Dashboard:** left rail `240–260px` collapsible; main `minmax(0, 1fr)`; optional right insight column `320px` on ≥1280px  
- **Breakpoints:** `640` / `768` / `1024` / `1280`  

---

## 6. Component styles

### 6.1 Buttons

| Variant | Surface | Text | Border |
|---------|---------|------|--------|
| **Primary** | `--color-primary` | dark ink on dark theme: `#0c1214` / light: white | none |
| **Secondary** | transparent | `--color-fg` | `--color-border` |
| **Ghost** | transparent | `--color-fg-secondary` | none |
| **Danger** | transparent or muted danger wash | `--color-danger` | danger at 40% |

**Specs:** height 40px (default) / 36px compact / 44px large; padding `0 16–20px`; radius `--radius-md`; weight 500; font Inter 14–15px.  
**Focus:** `0 0 0 3px var(--color-primary-muted)`.

### 6.2 Cards

- Background: `--color-surface`  
- Border: `1px solid var(--color-border)`  
- Radius: `--radius-md` or `--radius-lg`  
- Padding: `--space-5`  
- Hover (interactive only): border toward primary or surface-hover; no aggressive scale  

### 6.3 Inputs

- Height 40px; radius `--radius-sm`  
- Background: `--color-bg` or surface inset  
- Border: `--color-border`; focus border primary  
- Placeholder: `--color-fg-muted`  
- Label: `text-sm` medium above field, 6–8px gap  

### 6.4 Navigation

- **Marketing header:** transparent → solid surface on scroll; logo left; links center/right; dual CTAs right  
- **Dashboard rail:** logo + environment status; nav groups; user/home footer  
- Active item: primary-muted fill + primary text or left 2px accent bar  

### 6.5 Status pills

```
[ ● Local  ·  Online ]
```

- Height 24–28px; padding `0 10px`; radius `--radius-full`  
- Dot 6–8px with semantic color  
- Text `text-xs` medium mono or sans  
- Variants: Local / Cloud-off / Offline / Ask / Allowed / Denied  

### 6.6 Insight / suggestion cards

- Left 2–3px primary accent bar (optional)  
- Overline + title + 2-line body + action row (`Accept` / `Dismiss` / `Review`)  
- Keep density high but airy — HA elevated, not enterprise clutter  

### 6.7 Conversation (AI Property Manager)

- User bubbles: surface-hover, right-aligned  
- Agent bubbles: surface, left-aligned, subtle border  
- System / permission prompts: full-width inset with mono meta  
- Composer: sticky bottom, border-top, local model badge  

### 6.8 Permissions / guardrails panel

- Table or stacked rows: capability · scope · status  
- Toggle or segmented control: Always / Ask / Never  
- Copy must be plain language (“Control lights in Living Room”) not raw entity IDs in primary UI (IDs in mono secondary)  

---

## 7. Iconography & imagery

- Stroke icons 1.5–1.75px, rounded joins, 20–24px default  
- Prefer abstract architecture / quiet interiors / soft technical diagrams over robot mascots  
- Photography: cool daylight, natural materials, restrained tech — never RGB LED strip showcases  
- Charts: thin lines, primary + muted series only; no rainbow  

---

## 8. Voice & tone

### 8.1 Principles

| Do | Don’t |
|----|-------|
| Calm, precise, confident | Hype, “revolutionary”, exclamation spam |
| Sovereignty & permission language | Fear-mongering about competitors |
| Concrete home outcomes | Abstract “AI magic” |
| Technical honesty (local models, open weights) | Overclaiming autonomy |
| Respect for craft (GC, custom home) | Consumer gadget speak (“supercharge your smart home!”) |

### 8.2 Naming

- Product: **Solo Home AI**  
- Domain: **solohome.ai**  
- Role: **AI Property Manager** (not “assistant” as primary)  
- Package: **Robot-Ready Package** (for GCs)  
- Runtime stance: **Local-first**, **Permissioned agents**, **Open-source**  

### 8.3 Sample microcopy

| Context | Copy |
|---------|------|
| Hero | “The sovereign AI property manager for homes that stay yours.” |
| CTA homeowner | “Request a pilot” |
| CTA GC | “Specify robot-ready” |
| Local status | “Running locally · model online” |
| Permission ask | “Allow climate adjustments in the west wing for the next 4 hours?” |
| Empty state | “No open suggestions. Systems nominal.” |
| Error | “Couldn’t reach the local runtime. Your home automations continue offline.” |

### 8.4 Grammar

- Sentence case for UI labels  
- Oxford comma in marketing  
- Prefer “you / your home” over “users”  
- Avoid emoji in product UI; marketing may use sparingly if at all  

---

## 9. Design pillars (product narrative)

1. **Sovereign by default** — Local open-weight models; data does not leave the property without explicit policy  
2. **Permissioned agency** — Agents propose; guardrails decide; humans stay in control  
3. **Proactive, not chatty** — Insights when useful; silence when systems are nominal  
4. **Built for custom homes** — Zones, scenes, and GC packages — not DIY plugin chaos  
5. **Robot-ready foundation** — Wiring, sensors, and policy for a sensory platform that can grow  

---

## 10. Accessibility

- Body contrast ≥ 4.5:1 on surfaces; large text ≥ 3:1  
- Focus visible on all interactive elements  
- Status never color-only — include text or icon  
- Hit targets ≥ 40×40px where possible  
- Support `prefers-reduced-motion`  
- Semantic landmarks: `header`, `main`, `nav`, `footer`, `aside`  

---

## 11. Home Assistant integration surface

Solo Home AI sits **above** Home Assistant as a permissioned property-manager layer — not a replacement UI full of entity clutter. Reference patterns drawn from production agent HA adapters (e.g. Hermes Agent messaging) and the Open Home Foundation Device Database.

### 11.1 Dual path

| Path | Role | UI expression |
|------|------|---------------|
| **WebSocket gateway** | Real-time `state_changed` events into the agent | HA Bridge event feed; domain-formatted messages |
| **REST tools** | LLM-callable query/control | Tool chips + mono traces in conversation |

### 11.2 Tool set (product language)

| Tool | Purpose |
|------|---------|
| `ha_list_entities` | Inventory by domain / area |
| `ha_get_state` | Single-entity deep state |
| `ha_list_services` | Discover actions + params |
| `ha_call_service` | Execute (after guardrails) |

Primary UI uses plain language; **entity IDs and tool traces stay mono secondary** (conversation traces, bridge panel, device cards).

### 11.3 Event filters

- Default: **no events** until `watch_domains` / `watch_entities` / `watch_all` configured  
- Recommended start: `climate`, `binary_sensor`, `alarm_control_panel`, `light`  
- `ignore_entities` for noisy sensors (uptime, CPU, memory)  
- `cooldown_seconds` (default 30) per entity  

### 11.4 Security hard-blocks

Never expose as Always/Ask/Never — these are **non-negotiable host blocks**:

`shell_command` · `command_line` · `python_script` · `pyscript` · `hassio` · `rest_command`

Entity IDs must match `^[a-z_][a-z0-9_]*\.[a-z0-9_]+$`.

### 11.5 Device inventory

Prefer OHF-style catalog cards:

- Category + manufacturer + friendly name  
- **Local connection** vs **Requires internet** pills (success vs warning mono)  
- Nested entity rows with live state in mono  
- Flag cloud-required devices as policy-watched, not celebrated  

### 11.6 Event copy formats

| Domain | Format |
|--------|--------|
| climate | HVAC mode changed from 'off' to 'heat' (current: 21, target: 23) |
| binary_sensor | triggered / cleared |
| light / switch / fan | turned on / turned off |
| alarm_control_panel | alarm state changed from 'armed_away' to 'triggered' |

---

## 12. File map (this project)

| File | Purpose |
|------|---------|
| `DESIGN.md` | Brand & design system (this document) |
| `src/pages/LandingPage.tsx` | Marketing landing (React) |
| `src/pages/DashboardPage.tsx` | Homeowner dashboard — Overview, Manager, Zones, Devices, HA Bridge, Permissions, Operations |
| `src/pages/SystemMapPage.tsx` | Architecture + zone topology system map |
| `src/styles/*.css` | Prototype CSS preserved from Open Design |
| `public/prototypes/*.html` | Original single-file HTML prototypes (reference) |

---

## 13. Implementation notes

### Open Design (source prototypes)

- Single-file HTML prototypes: tokens in `:root`, components as utility-ish classes, no build step  
- Toggle `[data-theme="light"|"dark"]` on `<html>` for theme switch  
- Prefer CSS for structure; minimal JS for nav, theme, filters, and light interaction demos  
- Iterate tokens here first, then propagate to surfaces  
- Dashboard HA surface: keep bridge technical; marketing stays plain-language sovereignty  

### React app (this repo)

- Vite + React + TypeScript; routes `/`, `/app`, `/system-map`  
- Theme shared via `useTheme` + `localStorage` key `solohome-theme`  
- Dashboard Operations charts use ECharts; system map topology is SVG + DOM interactions  

---

*Solo Home AI Design System · v1.2 · Dark-first · Quiet luxury · Local-first · HA-native · React*
