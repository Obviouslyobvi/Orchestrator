# API

AI Orchestrator single-page app built with React + Vite + Tailwind.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deployment (static hosting)

This project is a static SPA and can be deployed to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

### Vercel

1. Push this repo to GitHub.
2. In Vercel, click **New Project** and import the repo.
3. Set build command to `npm run build` and output directory to `dist`.
4. Deploy.

### Netlify

1. Push this repo to GitHub.
2. In Netlify, click **Add new site** → **Import an existing project**.
3. Set build command to `npm run build` and publish directory to `dist`.
4. Deploy.

### Cloudflare Pages

1. Push this repo to GitHub.
2. Create a new Pages project from the repo.
3. Set build command to `npm run build` and output directory to `dist`.
4. Deploy.

