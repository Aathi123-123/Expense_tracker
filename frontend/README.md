# Save Karo

Save Karo is a small frontend-only expense tracker (Vite + React + Tailwind). Data is stored in localStorage. This scaffold includes charts (Recharts), framer-motion (for animation hooks), date-fns for date handling, and a PWA manifest + service-worker stub.

> GitHub ready: this repo contains a basic GitHub Actions workflow (`.github/workflows/ci.yml`) that installs dependencies and builds the frontend on push/PR. Update the `package.json` repository.url to point to your GitHub repository before pushing.

Quick start (Windows PowerShell):

```powershell
cd frontend
npm install
npm run dev
```

Build:

```powershell
npm run build
npm run preview
```

Notes:
- Theme: toggle the theme in the header. The theme uses CSS variables and Tailwind dark class. Change palette in `src/styles.css` and `tailwind.config.cjs` colors.
- Persistence: expenses saved under localStorage key `savekaro_expenses_v1`. Settings saved under `savekaro_settings_v1`.
- Receipts: images are stored as base64 in the expense object. Keep images small to avoid localStorage size limits.
- PWA: a basic `manifest.json` and `service-worker.js` stub are included. To enable offline installability, register the service worker in `src/main.jsx` and provide icons `icon-192.png` and `icon-512.png` in the `public` root.

Publishing to GitHub
--------------------

1. Create a new repository on GitHub (e.g. `save-karo`).
2. Update `package.json` -> `repository.url` with your repository URL (replace `https://github.com/your-username/save-karo.git`).
3. From the project root run:

```powershell
git init
git add .
git commit -m "Initial Save Karo frontend"
git branch -M main
git remote add origin https://github.com/your-username/save-karo.git
git push -u origin main
```

After you push, the GitHub Actions workflow will run on the `main` branch and produce a build artifact.

Notes on large assets and bundle size
-----------------------------------

If your build warns about large chunks (bundle size > 500 KB), consider:

- Moving large static assets (for example `src/assets/logo.svg`) into the `public/` folder so they're not inlined.
- Lazy-loading heavy libraries like `recharts` with `React.lazy()` so charts only load when needed.
- Using Vite `build.rollupOptions.output.manualChunks` to split vendor code.


Customization:
- Categories are free-form strings on the expense form. You can wire favorites or presets in `Settings`.

Dev tips:
- Tailwind config is in `tailwind.config.cjs`.
- Charts use Recharts in `src/components/Dashboard.jsx`.

License: MIT
