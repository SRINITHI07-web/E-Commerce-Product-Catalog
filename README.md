# Prodexa

A static React storefront built with HTML, CSS, and JavaScript. React and React Router load from their production browser bundles, so no framework CLI or local build server is required.

## Run locally

Open `index.html` in a browser. An internet connection is required for React, React Router, Google Fonts, and the product photography.

## Project structure

- `index.html` contains page metadata and loads the browser dependencies.
- `script.js` contains the React app, route definitions, cart state, and page components.
- `js/products.js` contains the product catalog data.
- `style.css` contains the responsive storefront styles.
- `script.min.js`, `style.min.css`, and `js/products.min.js` are formatted copies for easier reading. The page loads the readable source files.

The catalog uses React Router hash routes, browser storage for the cart, responsive image widths, product JSON-LD, and client-side search, filtering, and sorting.

## Deploy

The app is static and requires no build command.

### GitHub Pages

The `.github/workflows/pages.yml` workflow publishes the project root when changes are pushed to `main`. Create a GitHub repository, push the project files, and choose **Settings → Pages → GitHub Actions**. The public URL appears when the workflow completes.

### Vercel

The included `vercel.json` configures cache headers for the static source assets. Sign in with the Vercel CLI and run `vercel --prod` from the project directory to publish directly, or import a connected Git repository.

This workspace is not currently connected to either hosting account or a Git repository, so a public deployment still requires account access.

Both hosts serve this static frontend only. The checkout button is a front-end placeholder; real payments, order handling, and server-side product search require a separate backend and payment provider.
