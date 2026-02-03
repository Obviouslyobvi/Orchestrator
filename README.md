# California Data Brokers Database

A single-page app for tracking California data brokers, key decision-makers, and outreach pipelines. Built with React, TypeScript, Vite, and Tailwind.

## Product requirements

See the California Data Brokers Database PRD in [`PRD.md`](./PRD.md).

## Local development

```bash
npm install
npm run dev
```

## Environment variables

Create a `.env.local` file with the following key to enable the Gemini research assistant:

```bash
VITE_GEMINI_API_KEY=your_api_key_here
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
