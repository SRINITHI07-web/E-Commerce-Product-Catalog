# Prodexa

A responsive static storefront built with React, Vite, and CSS.

## Run locally

Install dependencies with `npm install`, then start the development server with `npm run dev`. Vite prints the local URL to open in a browser.

Run `npm run build` to create the production site in `dist/`, or `npm run preview` to preview that build locally.

An internet connection is required for Google Fonts and product photography.

## Project structure

- `index.html` contains page metadata and the React mount point.
- `src/main.jsx` contains the React storefront, hash-based routes, product filtering, and cart interactions.
- `product.js` exports the product catalog.
- `style.css` contains the responsive storefront styles.

The catalog uses hash routes, browser storage for the cart, responsive image widths, product JSON-LD, and client-side search, filtering, and sorting. React handles the interactive UI; responsive layouts are provided by the CSS breakpoints.

## Deploy

The production site is static and is compiled by Vite.

### GitHub Pages

The `.github/workflows/pages.yml` workflow builds the app and publishes `dist/` when changes are pushed to `main`. Set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. The public URL appears when the workflow completes.

### Vercel

Import the Git repository into Vercel. It detects the Vite build command and `dist/` output directory.

The project is connected to a GitHub repository, but publishing requires access to the hosting account.

Both hosts serve this static frontend only. The checkout button is a front-end placeholder; real payments, order handling, and server-side product search require a separate backend and payment provider.
