const root = document.getElementById("root");
const pageTitle = "Prodexa — Everyday essentials, made to last";
const products = window.StoreProducts;
const state = {
  cart: loadCart(),
  category: "All",
  query: "",
  sort: "featured",
  toastTimer: null,
};

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function loadCart() {
  try {
    const savedCart = JSON.parse(
      localStorage.getItem("prodexa-cart") ||
        localStorage.getItem("goodform-cart") ||
        "{}",
    );
    return Object.fromEntries(
      Object.entries(savedCart).filter(
        ([id, quantity]) =>
          products.some((product) => product.id === id) && quantity > 0,
      ),
    );
  } catch {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem("prodexa-cart", JSON.stringify(state.cart));
  } catch {
    // Browser storage may be unavailable in private browsing.
  }
}

function cartCount() {
  return Object.values(state.cart).reduce((sum, quantity) => sum + quantity, 0);
}

function imageSet(url) {
  return `${url.replace("w=1000", "w=480")} 480w, ${url.replace("w=1000", "w=800")} 800w, ${url.replace("w=1000", "w=1200")} 1200w`;
}

function eyebrow(text, className = "") {
  return `<span class="eyebrow ${className}">${escapeHTML(text)}</span>`;
}

function getLocation() {
  const fragment = decodeURIComponent(window.location.hash.slice(1));
  if (!fragment) return { path: "/", anchor: "" };
  if (!fragment.startsWith("/")) return { path: "/", anchor: fragment };

  const [path, anchor = ""] = fragment.split("#");
  return { path: path.replace(/\/$/, "") || "/", anchor };
}

function renderNavbar() {
  const count = cartCount();
  const { path } = getLocation();
  return `
    <header class="site-header">
      <a class="brand-lockup" href="#/" aria-label="Prodexa home">
        <span class="brand-mark">P</span>
        <span class="wordmark">Prodexa</span>
      </a>
      <nav class="main-nav" aria-label="Main navigation">
        <a href="#/products"${path.startsWith("/products") ? ' aria-current="page"' : ""}>Shop</a>
        <a href="/#our-way">Our way</a>
      </nav>
      <div class="header-actions">
        <a class="icon-link search-link" href="#/products" aria-label="Search products" title="Search products">⌕</a>
        <a class="cart-link" href="#/cart" aria-label="Shopping bag, ${count} items">
          <span>Bag</span><span class="cart-count">${count}</span>
        </a>
      </div>
    </header>`;
}

function renderProductCard(product) {
  const productUrl = `#/products/${encodeURIComponent(product.id)}`;
  return `
    <article class="product-card">
      <a class="product-image-link" href="${productUrl}" aria-label="View ${escapeHTML(product.name)}">
        <div class="product-image-wrap">
          <img src="${escapeHTML(product.image)}" srcset="${escapeHTML(imageSet(product.image))}" sizes="(max-width: 600px) 46vw, (max-width: 900px) 44vw, 24vw" alt="${escapeHTML(product.alt)}" loading="lazy" width="800" height="1000">
        </div>
      </a>
      <div class="product-meta">
        <div>
          <a class="product-name" href="${productUrl}">${escapeHTML(product.name)}</a>
          <p>${escapeHTML(product.category)} · ${escapeHTML(product.color)}</p>
        </div>
        <span class="product-price">₹${escapeHTML(product.price)}</span>
      </div>
    </article>`;
}

function getFilteredProducts() {
  const query = state.query.trim().toLowerCase();
  return products
    .filter((product) => {
      const categoryMatch =
        state.category === "All" || product.category === state.category;
      const queryMatch = `${product.name} ${product.category} ${product.color}`
        .toLowerCase()
        .includes(query);
      return categoryMatch && queryMatch;
    })
    .sort((first, second) => {
      if (state.sort === "price-low") return first.price - second.price;
      if (state.sort === "price-high") return second.price - first.price;
      if (state.sort === "name") return first.name.localeCompare(second.name);
      return products.indexOf(first) - products.indexOf(second);
    });
}

function renderCatalogResults() {
  const resultCount = document.getElementById("result-count");
  const productGrid = document.getElementById("product-grid");
  if (!resultCount || !productGrid) return;

  const filtered = getFilteredProducts();
  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "product" : "products"}`;
  productGrid.innerHTML = filtered.length
    ? filtered.map(renderProductCard).join("")
    : '<p class="empty-results">Nothing here just yet. Try another search.</p>';
}

function renderCatalog() {
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];
  return `
    <main class="catalog-page content-width">
      <section class="catalog-intro">
        ${eyebrow("New season")}
        <h1>Everyday essentials,<br>made to last.</h1>
        <p>Thoughtfully designed goods for the home and the road. Free shipping over ₹100.</p>
      </section>
      <label class="search-box catalog-search">
        <span aria-hidden="true">⌕</span>
        <input id="product-search" value="${escapeHTML(state.query)}" placeholder="Search products" aria-label="Search products">
      </label>
      <div class="category-tabs" role="group" aria-label="Filter by category">
        ${categories
          .map(
            (category) =>
              `<button type="button" class="category-tab${state.category === category ? " active" : ""}" data-category="${escapeHTML(category)}" aria-pressed="${state.category === category}">${escapeHTML(category)}</button>`,
          )
          .join("")}
      </div>
      <div class="catalog-toolbar">
        <p class="result-count" id="result-count"></p>
        <label class="sort-control">Sort:
          <select id="product-sort" aria-label="Sort products">
            <option value="featured"${state.sort === "featured" ? " selected" : ""}>Featured</option>
            <option value="price-low"${state.sort === "price-low" ? " selected" : ""}>Price: low to high</option>
            <option value="price-high"${state.sort === "price-high" ? " selected" : ""}>Price: high to low</option>
            <option value="name"${state.sort === "name" ? " selected" : ""}>Name A–Z</option>
          </select>
        </label>
      </div>
      <div class="product-grid" id="product-grid"></div>
    </main>`;
}

function renderSpotlight(product) {
  return `
    <section class="spotlight content-width" id="our-way">
      <div class="spotlight-image">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.alt)}" loading="lazy" width="1000" height="800">
      </div>
      <div class="spotlight-copy">
        ${eyebrow("Bestseller")}
        <h2>${escapeHTML(product.name)}</h2>
        <p>${escapeHTML(product.description)}</p>
        <div class="spotlight-actions">
          <a class="text-link" href="#/products/${encodeURIComponent(product.id)}">₹${escapeHTML(product.price)} · View details</a>
          <button class="spotlight-add" type="button" data-add="${escapeHTML(product.id)}">Add to bag <span aria-hidden="true">+</span></button>
        </div>
      </div>
    </section>`;
}

function renderProductDetail(product) {
  if (!product) {
    return `
      <main class="not-found content-width">
        ${eyebrow("Well, this is awkward")}
        <h1>We couldn’t find that one.</h1>
        <a class="text-link" href="#/products">Back to the collection ↗</a>
      </main>`;
  }

  return `
    <main class="detail-page content-width">
      <a class="back-link" href="#/products">← All objects</a>
      <div class="detail-layout">
        <div class="detail-image">
          <img src="${escapeHTML(product.image)}" srcset="${escapeHTML(imageSet(product.image))}" sizes="(max-width: 600px) 92vw, 52vw" alt="${escapeHTML(product.alt)}" width="1200" height="1500" fetchpriority="high">
        </div>
        <div class="detail-info">
          ${eyebrow(`${product.category} / ${product.label}`)}
          <h1>${escapeHTML(product.name)}</h1>
          <p class="detail-price">₹${escapeHTML(product.price)}.00</p>
          <p class="detail-description">${escapeHTML(product.description)}</p>
          <p class="detail-color"><span>Color</span>${escapeHTML(product.color)}</p>
          <button class="button button-dark add-detail" type="button" data-add="${escapeHTML(product.id)}">Add to bag <span>₹${escapeHTML(product.price)}.00</span></button>
          <p class="shipping-note">Complimentary shipping on orders over ₹100.</p>
          <div class="detail-perks">
            <p><span>01</span>Made with care, meant to last</p>
            <p><span>02</span>Considered materials, always</p>
            <p><span>03</span>Easy returns within 30 days</p>
          </div>
        </div>
      </div>
    </main>`;
}

function cartEntries() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => ({
      product: products.find((product) => product.id === id),
      quantity,
    }))
    .filter((entry) => entry.product);
}

function renderCart() {
  const entries = cartEntries();
  const subtotal = entries.reduce(
    (sum, entry) => sum + entry.product.price * entry.quantity,
    0,
  );
  const content = entries.length
    ? `
      <div class="cart-layout">
        <div class="cart-items">
          ${entries
            .map(
              ({ product, quantity }) => `
                <article class="cart-item">
                  <a href="#/products/${encodeURIComponent(product.id)}" class="cart-item-image">
                    <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.alt)}" width="300" height="360">
                  </a>
                  <div class="cart-item-info">
                    <a href="#/products/${encodeURIComponent(product.id)}" class="product-name">${escapeHTML(product.name)}</a>
                    <p>${escapeHTML(product.color)}</p>
                    <div class="quantity-control">
                      <button type="button" data-quantity="${escapeHTML(product.id)}" data-delta="-1" aria-label="Decrease ${escapeHTML(product.name)} quantity">−</button>
                      <span>${quantity}</span>
                      <button type="button" data-quantity="${escapeHTML(product.id)}" data-delta="1" aria-label="Increase ${escapeHTML(product.name)} quantity">+</button>
                    </div>
                    <button class="remove-item" type="button" data-remove="${escapeHTML(product.id)}">Remove</button>
                  </div>
                  <span class="cart-item-price">₹${product.price * quantity}.00</span>
                </article>`,
            )
            .join("")}
        </div>
        <aside class="order-summary">
          ${eyebrow("A little recap")}
          <div class="summary-line"><span>Subtotal</span><span>₹${subtotal}.00</span></div>
          <p>Shipping and taxes are calculated at checkout.</p>
          <button class="button button-dark checkout-button" type="button" data-checkout>Continue to checkout <span aria-hidden="true">↗</span></button>
          <a class="continue-shopping" href="#/products">Keep looking around</a>
        </aside>
      </div>`
    : `
      <div class="empty-cart">
        <p>Your bag is taking a quiet moment.</p>
        <a class="button button-dark" href="#/products">Explore the collection <span aria-hidden="true">↗</span></a>
      </div>`;

  return `
    <main class="cart-page content-width">
      <div class="cart-heading">
        ${eyebrow("Your good things")}
        <h1>Your bag<span>.</span></h1>
      </div>
      ${content}
    </main>`;
}

function renderNotFound() {
  return `
    <main class="not-found content-width">
      ${eyebrow("404 / Lost in the shop")}
      <h1>This page wandered off.</h1>
      <a class="text-link" href="#/">Back to the good stuff ↗</a>
    </main>`;
}

function renderToast() {
  return `<div class="toast-host" id="toast-host" aria-live="polite"></div>`;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <a class="wordmark" href="#/">Prodexa</a>
      <p>Everyday essentials, made to last.</p>
      <span>© Prodexa 2026</span>
    </footer>`;
}

function updateProductMetadata(product) {
  document.getElementById("product-structured-data")?.remove();
  document.title = product ? `${product.name} — Prodexa` : pageTitle;
  if (!product) return;

  const structuredData = document.createElement("script");
  structuredData.id = "product-structured-data";
  structuredData.type = "application/ld+json";
  structuredData.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  });
  document.head.append(structuredData);
}

function render() {
  const { path } = getLocation();
  let content;
  let detailProduct = null;

  if (path === "/") {
    content = `${renderCatalog()}${renderSpotlight(products[0])}`;
  } else if (path === "/products") {
    content = renderCatalog();
  } else if (path.startsWith("/products/")) {
    const id = path.slice("/products/".length);
    detailProduct = products.find((product) => product.id === id) || null;
    content = renderProductDetail(detailProduct);
  } else if (path === "/cart") {
    content = renderCart();
  } else {
    content = renderNotFound();
  }

  root.innerHTML = `${renderNavbar()}${content}${renderToast()}${renderFooter()}`;
  updateProductMetadata(detailProduct);
  renderCatalogResults();
}

function showToast(message) {
  const host = document.getElementById("toast-host");
  if (!host) return;
  host.innerHTML = `
    <div class="cart-toast" role="status">
      <span class="cart-toast-icon" aria-hidden="true">✓</span>
      <span>${escapeHTML(message)}</span>
    </div>`;
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => {
    const currentHost = document.getElementById("toast-host");
    if (currentHost) currentHost.innerHTML = "";
  }, 2400);
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveCart();
  const count = cartCount();
  const countElement = document.querySelector(".cart-count");
  const cartLink = document.querySelector(".cart-link");
  if (countElement) countElement.textContent = count;
  if (cartLink)
    cartLink.setAttribute("aria-label", `Shopping bag, ${count} items`);
  showToast(`${product.name} added to bag`);
}

function changeQuantity(id, delta) {
  const nextQuantity = (state.cart[id] || 0) + delta;
  if (nextQuantity < 1) delete state.cart[id];
  else state.cart[id] = nextQuantity;
  saveCart();
  render();
}

root.addEventListener("click", (event) => {
  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    state.category = categoryButton.dataset.category;
    render();
    return;
  }

  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    addToCart(addButton.dataset.add);
    return;
  }

  const quantityButton = event.target.closest("[data-quantity]");
  if (quantityButton) {
    changeQuantity(
      quantityButton.dataset.quantity,
      Number(quantityButton.dataset.delta),
    );
    return;
  }

  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    delete state.cart[removeButton.dataset.remove];
    saveCart();
    render();
    return;
  }

  if (event.target.closest("[data-checkout]")) {
    window.alert("Checkout is coming soon. Your bag is saved right here.");
  }
});

root.addEventListener("input", (event) => {
  if (event.target.id !== "product-search") return;
  state.query = event.target.value;
  renderCatalogResults();
});

root.addEventListener("change", (event) => {
  if (event.target.id !== "product-sort") return;
  state.sort = event.target.value;
  renderCatalogResults();
});

window.addEventListener("hashchange", () => {
  render();
  const { anchor } = getLocation();
  if (anchor) {
    requestAnimationFrame(() =>
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" }),
    );
  } else {
    window.scrollTo(0, 0);
  }
});

render();
