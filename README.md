# California Data Brokers Database

A single-page app for tracking California data brokers, key decision-makers, and outreach pipelines. Built with React, TypeScript, Vite, and Tailwind.

**Live site:** [https://obviouslyobvi.github.io/Orchestrator/](https://obviouslyobvi.github.io/Orchestrator/)

## Deploy from URL

Deploy your own instance with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FObviouslyobvi%2FOrchestrator&env=VITE_GEMINI_API_KEY&envDescription=Google%20Gemini%20API%20key%20for%20the%20AI%20research%20assistant%20(optional)&project-name=ca-data-brokers&repository-name=ca-data-brokers)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Obviouslyobvi/Orchestrator)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Obviouslyobvi/Orchestrator)

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

This project is a static SPA and can be deployed to any static host. The easiest way is to use the **Deploy from URL** buttons above — they handle build configuration automatically.

Platform config files are included in the repo:
- `vercel.json` — Vercel build settings and SPA rewrites
- `netlify.toml` — Netlify build settings and SPA redirects

### Manual deployment

For any static host, run:

```bash
npm run build
```

Then upload the `dist` directory. Make sure your host rewrites all routes to `index.html` for SPA routing.
