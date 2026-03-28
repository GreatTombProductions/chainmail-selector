# CLAUDE.md — community-tools/chainmail-selector/

Ring size calculator for chainmail weaving projects.

---

## What This Is

Interactive tool for selecting appropriate ring sizes (wire gauge + inner diameter) for various chainmail weaves. Calculates aspect ratios (AR = ID ÷ wire diameter) and shows which rings work for each weave pattern.

**Purpose:** Help chainmail makers quickly identify compatible ring sizes for specific weave patterns without manual calculation.

---

## Tech Stack

**Vite + React + Tailwind:**
- React 18
- Tailwind CSS for styling
- Vite for build/dev
- GitHub Actions for auto-deployment to Pages

---

## How to Run Locally

```bash
cd /Users/rayheberer/Documents/greattomb/community-tools/chainmail-selector
npm install
npm run dev
```

**Remote verification:**
```bash
npm run dev -- --host
```

**Build and preview:**
```bash
npm run build
npm run preview
```

---

## Current State

**Status:** Complete, ready for deployment

**Features:**
- 20 chainmail weave patterns with AR requirements
- Interactive weave selector
- Visual AR grid (wire gauges × inner diameters)
- Color-coded compatibility (ideal/primary/secondary ranges)
- Support for two-size weaves (Helm Chain, Dragonscale, Celtic Visions)
- Sorted ring recommendations (ideal matches first)
- Mobile-friendly responsive design

---

## Key Files & Entry Points

- `src/ChainmailSelector.jsx` - Main component with all weave/ring data and logic
- `src/App.jsx` - Root component wrapper
- `src/main.jsx` - React entry point
- `vite.config.js` - Configured for `/chainmail-selector/` base path
- `.github/workflows/deploy.yml` - Auto-deploy to GitHub Pages on push

---

## Data Structure

**Wire Gauges:**
- 20 SWG (0.9mm)
- 18 SWG (1.2mm)
- 16 SWG (1.6mm)
- 14 SWG (2.0mm)

**Inner Diameters:**
- 13 sizes from 7/64" (2.8mm) to 5/8" (16.0mm)

**Weaves:**
- Name, AR range (min/max), ideal AR
- Support for two-size weaves with primary/secondary ring requirements

---

## Deployment

**GitHub Pages:**
- Repo: `github.com/greattombproductions/chainmail-selector`
- Live URL: `https://greattombproductions.github.io/chainmail-selector/`
- Auto-deploys on push to main via GitHub Actions

**Setup steps:**
1. Initialize git: `git init`
2. Add remote: `git remote add origin git@github.com:greattombproductions/chainmail-selector.git`
3. Push: `git add . && git commit -m "Initial chainmail selector" && git push -u origin main`
4. Enable GitHub Pages in repo Settings → Pages → Source: GitHub Actions

---

## Notes

**Data Source:**
Ring sizes and AR values based on Chainmail Joe's ring sizer guide (standard reference for chainmail makers).

**Usage Pattern:**
1. Select a weave pattern
2. View compatible ring combinations in grid (color-coded)
3. See sorted list of recommended rings (ideal matches first)
4. For two-size weaves, toggle between primary/secondary ring lists

**Design Decisions:**
- Dark theme (gray-900 background) for visual comfort
- Purple accents for active selections
- Yellow highlights for ideal AR matches
- Grid limited to first 11 ID sizes (most commonly used)

---

## Library References

<!-- LIBRARY: greattomb library show reference-based-specification -->
- **reference-based-specification**: This project is a clean reference artifact for future community tools — self-contained React/Vite/Tailwind app with GitHub Pages auto-deploy and domain-specific data. Spec new tools by pointing at this one ("make something like chainmail-selector but for X").

---

*Community tool for chainmail makers. Part of Czarkain creative ecosystem (Great Tomb Productions).*
