# Prodexa

A static storefront built with HTML, CSS, and vanilla JavaScript.

## Run locally

Open `index.html` directly in a browser. No package installation or build step is required.

An internet connection is required for Google Fonts and product photography.

## Project structure

- `index.html` contains page metadata and loads the catalog and storefront scripts.
- `script.js` renders the storefront, handles hash-based routes, filters the catalog, and manages cart state.
- `product.js` contains the product catalog data; `product.min.js` is its minified copy.
- `style.css` contains the responsive storefront styles.
- `style.min.css` is the minified stylesheet copy.

The catalog uses hash routes, browser storage for the cart, responsive image widths, product JSON-LD, and client-side search, filtering, and sorting.

## Deploy

The project is static and has no build command.

### GitHub Pages

The `.github/workflows/pages.yml` workflow publishes the project files when changes are pushed to `main`. Create a GitHub repository, push the project files, and choose **Settings → Pages → GitHub Actions**. The public URL appears when the workflow completes.

### Vercel

Vercel serves the project as a static site using the included configuration. Import the Git repository or run `vercel --prod` from the project directory.

The project is connected to a GitHub repository, but publishing requires access to the hosting account.

Both hosts serve this static frontend only. The checkout button is a front-end placeholder; real payments, order handling, and server-side product search require a separate backend and payment provider.
