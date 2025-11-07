# DrPal Skin & Face Analysis (Browser Demo)

This is a **self-contained React + Vite + TypeScript + Tailwind v4** front‑end that runs entirely in the browser.
It uses a simple, client-side heuristic to estimate a few skin metrics from an uploaded photo (no server required).

## Quickstart
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Notes
- Tailwind v4 is used via `index.css` already included.
- The original files you provided are kept at the project root for reference.
- The new working app lives under `/src` and uses `translations.ts` for basic i18n (FA/AR/EN).
- The image analysis is only a rough demo. For production, replace it with a proper model (e.g. TensorFlow.js) and server APIs.

---

## Quick temporary publishing options

### Option A — Vercel (fastest previews)
1) Push this folder to a GitHub repo.
2) Go to vercel.com → **Add New Project** → Import your repo.
3) Framework preset: **Vite**, Build command: `npm run build`, Output: `dist` (already set in `vercel.json`).
4) Click **Deploy**. You’ll get a preview URL like `https://your-project.vercel.app`.

### Option B — Netlify
- Connect your Git repo in app.netlify.com → New site from Git → Build: `npm run build`, Publish: `dist` (preconfigured via `netlify.toml`).

### Option C — GitHub Pages (no extra accounts)
1) Commit & push to a repo.
2) Ensure your repo’s default branch is **main**.
3) GitHub runs `.github/workflows/pages.yml` and publishes to Pages automatically.
   - If your repo is `username/repo`, GitHub Pages URL will be `https://username.github.io/repo/`.
   - For this case, set a base path in `vite.config.ts` like:
     ```ts
     export default defineConfig({ plugins:[react()], base: '/repo/' })
     ```

### Zero-install browser preview (StackBlitz)
- Go to stackblitz.com → **Import Project** → Upload the ZIP (`DrPal-skin-site-finished.zip`). It will run and give you a shareable URL.
