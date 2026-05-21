# Vikas Thakur — Portfolio

Static React site. No build step. Just open `index.html` in a browser, or drop the whole folder onto any static host.

## Files

```
My_Portfolio/
├── index.html          ← home
├── case-study.html     ← case-study template (opened via ?slug=...)
└── src/
    ├── data.js
    ├── case-studies.js
    ├── v2-app.jsx       (compiled in-browser by Babel)
    ├── v2-case.jsx
    └── v2-styles.css
```

Loads React 18 + Babel Standalone from unpkg and fonts from Google Fonts. The user's browser does the JSX compile on page load — fine for a portfolio, no build pipeline needed.

## Make it live — fastest paths

### Option 1 — Netlify Drop (~30 seconds, no account required to preview)
1. Go to https://app.netlify.com/drop
2. Drag this entire `My_Portfolio` folder onto the page
3. You get a live URL like `https://random-name-12345.netlify.app` immediately
4. Sign in (Google/GitHub) to claim the site and give it a custom subdomain

### Option 2 — Vercel
1. Push the folder to a GitHub repo
2. Go to https://vercel.com/new, import the repo
3. Framework preset: **Other** (it's static, nothing to build)
4. Deploy → you get `your-project.vercel.app`

### Option 3 — Cloudflare Pages
1. https://pages.cloudflare.com → Create project → Direct upload
2. Drop the folder. Done.

### Option 4 — GitHub Pages
1. Create a repo, push these files to `main`
2. Repo settings → Pages → Source: `main` branch, `/ (root)`
3. Live at `https://<username>.github.io/<repo-name>/`

## Custom domain
All four options above let you point a custom domain (e.g. `vikasthakur.com`) at the deployment for free — add the domain in the host's dashboard, then update DNS at your registrar.

## Local preview before deploying
If you want to test locally without `file://` quirks:
```bash
cd My_Portfolio
python3 -m http.server 8000
# then open http://localhost:8000
```

## Production tip
For a polished launch, swap the React/Babel CDN scripts in `index.html` and `case-study.html` from `.development.js` to `.production.min.js` — faster load, smaller bundle. Babel-in-browser is fine for now but pre-compiling the JSX with a real build (Vite, esbuild) would be even faster. Happy to wire that up if you want.
