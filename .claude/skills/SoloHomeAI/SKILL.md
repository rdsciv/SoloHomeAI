```markdown
# SoloHomeAI Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill provides guidance for contributing to the SoloHomeAI repository, a TypeScript project built with the Vite framework. It covers the project's coding conventions, file organization, and common workflows, especially around routing and static hosting for single-page applications (SPAs). Use this as a reference for maintaining consistency and efficiently managing routing-related updates.

## Coding Conventions

### File Naming

- **CamelCase** is used for file names.
  - Example: `userProfile.tsx`, `appRouter.ts`
- Test files follow the pattern: `*.test.*`
  - Example: `userProfile.test.ts`

### Imports

- **Relative imports** are preferred.
  - Example:
    ```typescript
    import userService from '../services/userService'
    import Dashboard from './Dashboard'
    ```

### Exports

- **Mixed export styles** are used (default and named exports).
  - Example (default export):
    ```typescript
    export default function Dashboard() { ... }
    ```
  - Example (named export):
    ```typescript
    export function useAuth() { ... }
    ```

### Commit Messages

- **Freeform** style, often with short prefixes.
- Average commit message length: ~40 characters.
  - Example: `fix dashboard navigation on direct load`

## Workflows

### Update Routing and Static Hosting

**Trigger:** When you need to fix or improve navigation, deep links, or static hosting behavior (e.g., 404s on direct URL loads), especially for SPAs deployed on static hosts like Vercel.

**Command:** `/fix-routing`

**Step-by-Step Instructions:**

1. **Edit or Add Static HTML Files**
   - Update or create HTML files for affected routes in `public/`.
     - Example: `public/app.html`, `public/dashboard.html`
   - For nested routes, add `public/route/index.html`.

2. **Update Vercel Configuration**
   - Edit `vercel.json` to declare new redirects or rewrites.
     - Example:
       ```json
       {
         "rewrites": [
           { "source": "/dashboard", "destination": "/dashboard.html" }
         ]
       }
       ```

3. **Modify React Router Usage**
   - Adjust routing logic in `src/App.tsx` and related page components in `src/pages/`.
     - Example:
       ```typescript
       import { BrowserRouter, Routes, Route } from 'react-router-dom';

       function App() {
         return (
           <BrowserRouter>
             <Routes>
               <Route path="/dashboard" element={<Dashboard />} />
             </Routes>
           </BrowserRouter>
         );
       }
       ```

4. **Update Documentation**
   - If navigation behavior changes, update `README.md` to reflect new routes or navigation instructions.

5. **Adjust Dependencies**
   - If you change routing libraries or related dependencies, update `package.json` accordingly.

**Files Involved:**
- `public/*.html`
- `public/*/index.html`
- `vercel.json`
- `src/App.tsx`
- `src/pages/*.tsx`
- `README.md`
- `package.json`

**Frequency:** ~2 times per month

---

## Testing Patterns

- **Test files** use the `*.test.*` naming convention.
  - Example: `auth.test.ts`
- **Testing framework** is not specified; check existing test files for patterns.
- Place test files alongside the modules they test or in a dedicated `tests/` directory if present.

## Commands

| Command      | Purpose                                                          |
|--------------|------------------------------------------------------------------|
| /fix-routing | Guide for updating routing and static hosting for navigation fixes|

```