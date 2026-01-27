# Chainmail Selector — GitHub Pages Deployment

## Context

There's a React component at `community-tools/chainmail-selector/ChainmailSelector.jsx` that needs to be deployed to GitHub Pages under the greattombproductions organization (like the existing splits calculator at https://greattombproductions.github.io/splits/).

## What Already Exists

- `ChainmailSelector.jsx` — Complete React component using Tailwind CSS
- The greattombproductions GitHub org already has Pages set up

## What You Need To Do

### 1. Set up Vite project in the chainmail-selector directory

```bash
cd community-tools/chainmail-selector
npm create vite@latest . -- --template react
```

If it complains about existing files, work around it (create in temp dir and move, or manually init).

### 2. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure `tailwind.config.js`:
```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

Add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Move/integrate the component

- Move `ChainmailSelector.jsx` to `src/ChainmailSelector.jsx`
- Update `src/App.jsx` to import and render it
- Update `index.html` title to "Chainmail Ring Selector"

### 4. Configure for GitHub Pages deployment

In `vite.config.js`, set the base path for the repo name:
```js
export default defineConfig({
  plugins: [react()],
  base: '/chainmail-selector/',
})
```

### 5. Build and test locally

```bash
npm run build
npm run preview
```

Verify it works at http://localhost:4173/chainmail-selector/

### 6. Set up GitHub Actions for auto-deploy (optional but nice)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: './package-lock.json'
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### 7. Initialize git and push

```bash
git init
git add .
git commit -m "Initial chainmail selector"
git remote add origin git@github.com:greattombproductions/chainmail-selector.git
git push -u origin main
```

### 8. Enable GitHub Pages

Ray will need to go to repo Settings → Pages → Source: GitHub Actions

---

## Expected Result

- Repo at github.com/greattombproductions/chainmail-selector
- Live site at https://greattombproductions.github.io/chainmail-selector/
- Auto-deploys on push to main

## Notes

- The component is self-contained, no external API calls
- Uses only Tailwind core utilities (no custom plugins needed)
- Mobile-friendly (tested with responsive design)
