const e = (type, props, ...children) =>
  React.createElement(type, props, ...children.flat(Infinity));
const { useEffect, useMemo, useRef, useState } = React;
const { HashRouter, Link, NavLink, Route, Routes, useLocation, useParams } =
  ReactRouterDOM;

const products = window.StoreProducts;

const imageSet = (url) =>
  `${url.replace("w=1000", "w=480")} 480w, ${url.replace("w=1000", "w=800")} 800w, ${url.replace("w=1000", "w=1200")} 1200w`;
const eyebrow = (text, className = "") =>
  e("span", { className: `eyebrow ${className}`.trim() }, text);

function Navbar({ cartCount }) {
  return e(
    "header",
    { className: "site-header" },
    e(
      Link,
      { className: "brand-lockup", to: "/", "aria-label": "Prodexa home" },
      e("span", { className: "brand-mark" }, "P"),
      e("span", { className: "wordmark" }, "Prodexa"),
    ),
    e(
      "nav",
      { className: "main-nav", "aria-label": "Main navigation" },
      e(NavLink, { to: "/products" }, "Shop"),
      e(Link, { to: "/#our-way" }, "Our way"),
    ),
    e(
      "div",
      { className: "header-actions" },
      e(
        Link,
        {
          className: "icon-link search-link",
          to: "/products",
          "aria-label": "Search products",
          title: "Search products",
        },
        "⌕",
      ),
      e(
        Link,
        {
          className: "cart-link",
          to: "/cart",
          "aria-label": `Shopping bag, ${cartCount} items`,
        },
        e("span", null, "Bag"),
        e("span", { className: "cart-count" }, cartCount),
      ),
    ),
  );
}

function ProductCard({ product, onAdd }) {
  return e(
    "article",
    { className: "product-card" },
    e(
      Link,
      {
        className: "product-image-link",
        to: `/products/${product.id}`,
        "aria-label": `View ${product.name}`,
      },
      e(
        "div",
        { className: "product-image-wrap" },
        e("img", {
          src: product.image,
          srcSet: imageSet(product.image),
          sizes: "(max-width: 600px) 46vw, (max-width: 900px) 44vw, 24vw",
          alt: product.alt,
          loading: "lazy",
          width: 800,
          height: 1000,
        }),
      ),
    ),
    e(
      "div",
      { className: "product-meta" },
      e(
        "div",
        null,
        e(
          Link,
          { className: "product-name", to: `/products/${product.id}` },
          product.name,
        ),
        e("p", null, `${product.category} · ${product.color}`),
      ),
      e("span", { className: "product-price" }, `₹${product.price}`),
    ),
  );
}

function Home({ onAdd }) {
  return e(
    React.Fragment,
    null,
    e(Catalog, { onAdd }),
    e(Spotlight, { product: products[0], onAdd }),
  );
}

function Catalog({ onAdd }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];
  const filtered = useMemo(
    () =>
      products
        .filter((product) => {
          const categoryMatch =
            category === "All" || product.category === category;
          const queryMatch =
            `${product.name} ${product.category} ${product.color}`
              .toLowerCase()
              .includes(query.trim().toLowerCase());
          return categoryMatch && queryMatch;
        })
        .sort((first, second) => {
          if (sort === "price-low") return first.price - second.price;
          if (sort === "price-high") return second.price - first.price;
          if (sort === "name") return first.name.localeCompare(second.name);
          return products.indexOf(first) - products.indexOf(second);
        }),
    [category, query, sort],
  );
  return e(
    "main",
    { className: "catalog-page content-width" },
    e(
      "section",
      { className: "catalog-intro" },
      eyebrow("New season"),
      e("h1", null, "Everyday essentials,", e("br"), "made to last."),
      e(
        "p",
        null,
        "Thoughtfully designed goods for the home and the road. Free shipping over ₹100.",
      ),
    ),
    e(
      "label",
      { className: "search-box catalog-search" },
      e("span", { "aria-hidden": true }, "⌕"),
      e("input", {
        id: "product-search",
        value: query,
        onChange: (event) => setQuery(event.target.value),
        placeholder: "Search products",
        "aria-label": "Search products",
      }),
    ),
    e(
      "div",
      {
        className: "category-tabs",
        role: "group",
        "aria-label": "Filter by category",
      },
      categories.map((item) =>
        e(
          "button",
          {
            key: item,
            type: "button",
            className:
              category === item ? "category-tab active" : "category-tab",
            onClick: () => setCategory(item),
          },
          item,
        ),
      ),
    ),
    e(
      "div",
      { className: "catalog-toolbar" },
      e(
        "p",
        { className: "result-count" },
        `${filtered.length} ${filtered.length === 1 ? "product" : "products"}`,
      ),
      e(
        "label",
        { className: "sort-control" },
        "Sort:",
        e(
          "select",
          {
            value: sort,
            onChange: (event) => setSort(event.target.value),
            "aria-label": "Sort products",
          },
          e("option", { value: "featured" }, "Featured"),
          e("option", { value: "price-low" }, "Price: low to high"),
          e("option", { value: "price-high" }, "Price: high to low"),
          e("option", { value: "name" }, "Name A–Z"),
        ),
      ),
    ),
    filtered.length
      ? e(
          "div",
          { className: "product-grid" },
          filtered.map((product) =>
            e(ProductCard, { key: product.id, product, onAdd }),
          ),
        )
      : e(
          "p",
          { className: "empty-results" },
          "Nothing here just yet. Try another search.",
        ),
  );
}

function Spotlight({ product, onAdd }) {
  return e(
    "section",
    { className: "spotlight content-width", id: "our-way" },
    e(
      "div",
      { className: "spotlight-image" },
      e("img", {
        src: product.image,
        alt: product.alt,
        loading: "lazy",
        width: 1000,
        height: 800,
      }),
    ),
    e(
      "div",
      { className: "spotlight-copy" },
      eyebrow("Bestseller"),
      e("h2", null, product.name),
      e("p", null, product.description),
      e(
        "div",
        { className: "spotlight-actions" },
        e(
          Link,
          { className: "text-link", to: `/products/${product.id}` },
          `₹${product.price} · View details`,
        ),
        e(
          "button",
          {
            className: "spotlight-add",
            type: "button",
            onClick: () => onAdd(product.id),
          },
          "Add to bag",
          e("span", { "aria-hidden": true }, "+"),
        ),
      ),
    ),
  );
}

function ProductDetail({ onAdd }) {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  useEffect(() => {
    if (!product) return undefined;
    document.title = `${product.name} — Prodexa`;
    const structuredData = document.createElement("script");
    structuredData.type = "application/ld+json";
    structuredData.id = "product-structured-data";
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
    document.getElementById("product-structured-data")?.remove();
    document.head.append(structuredData);
    return () => {
      structuredData.remove();
      document.title = "Prodexa — Everyday essentials, made to last";
    };
  }, [product]);
  if (!product)
    return e(
      "main",
      { className: "not-found content-width" },
      eyebrow("Well, this is awkward"),
      e("h1", null, "We couldn’t find that one."),
      e(
        Link,
        { className: "text-link", to: "/products" },
        "Back to the collection ↗",
      ),
    );
  return e(
    "main",
    { className: "detail-page content-width" },
    e(Link, { className: "back-link", to: "/products" }, "← All objects"),
    e(
      "div",
      { className: "detail-layout" },
      e(
        "div",
        { className: "detail-image" },
        e("img", {
          src: product.image,
          srcSet: imageSet(product.image),
          sizes: "(max-width: 600px) 92vw, 52vw",
          alt: product.alt,
          width: 1200,
          height: 1500,
          fetchPriority: "high",
        }),
      ),
      e(
        "div",
        { className: "detail-info" },
        eyebrow(`${product.category} / ${product.label}`),
        e("h1", null, product.name),
        e("p", { className: "detail-price" }, `₹${product.price}.00`),
        e("p", { className: "detail-description" }, product.description),
        e(
          "p",
          { className: "detail-color" },
          e("span", null, "Color"),
          product.color,
        ),
        e(
          "button",
          {
            className: "button button-dark add-detail",
            type: "button",
            onClick: () => onAdd(product.id),
          },
          "Add to bag ",
          e("span", null, `₹${product.price}.00`),
        ),
        e(
          "p",
          { className: "shipping-note" },
          "Complimentary shipping on orders over ₹100.",
        ),
        e(
          "div",
          { className: "detail-perks" },
          [
            "Made with care, meant to last",
            "Considered materials, always",
            "Easy returns within 30 days",
          ].map((text, index) =>
            e("p", { key: text }, e("span", null, `0${index + 1}`), text),
          ),
        ),
      ),
    ),
  );
}

function Cart({ cart, onQuantityChange, onRemove }) {
  const entries = Object.entries(cart)
    .map(([id, quantity]) => ({
      product: products.find((item) => item.id === id),
      quantity,
    }))
    .filter((entry) => entry.product);
  const subtotal = entries.reduce(
    (sum, entry) => sum + entry.product.price * entry.quantity,
    0,
  );
  return e(
    "main",
    { className: "cart-page content-width" },
    e(
      "div",
      { className: "cart-heading" },
      eyebrow("Your good things"),
      e("h1", null, "Your bag", e("span", null, ".")),
    ),
    entries.length === 0
      ? e(
          "div",
          { className: "empty-cart" },
          e("p", null, "Your bag is taking a quiet moment."),
          e(
            Link,
            { className: "button button-dark", to: "/products" },
            "Explore the collection ",
            e("span", { "aria-hidden": true }, "↗"),
          ),
        )
      : e(
          "div",
          { className: "cart-layout" },
          e(
            "div",
            { className: "cart-items" },
            entries.map(({ product, quantity }) =>
              e(
                "article",
                { className: "cart-item", key: product.id },
                e(
                  Link,
                  {
                    to: `/products/${product.id}`,
                    className: "cart-item-image",
                  },
                  e("img", {
                    src: product.image,
                    alt: product.alt,
                    width: 300,
                    height: 360,
                  }),
                ),
                e(
                  "div",
                  { className: "cart-item-info" },
                  e(
                    Link,
                    {
                      to: `/products/${product.id}`,
                      className: "product-name",
                    },
                    product.name,
                  ),
                  e("p", null, product.color),
                  e(
                    "div",
                    { className: "quantity-control" },
                    e(
                      "button",
                      {
                        type: "button",
                        onClick: () =>
                          onQuantityChange(product.id, quantity - 1),
                        "aria-label": `Decrease ${product.name} quantity`,
                      },
                      "−",
                    ),
                    e("span", null, quantity),
                    e(
                      "button",
                      {
                        type: "button",
                        onClick: () =>
                          onQuantityChange(product.id, quantity + 1),
                        "aria-label": `Increase ${product.name} quantity`,
                      },
                      "+",
                    ),
                  ),
                  e(
                    "button",
                    {
                      className: "remove-item",
                      type: "button",
                      onClick: () => onRemove(product.id),
                    },
                    "Remove",
                  ),
                ),
                e(
                  "span",
                  { className: "cart-item-price" },
                  `₹${product.price * quantity}.00`,
                ),
              ),
            ),
          ),
          e(
            "aside",
            { className: "order-summary" },
            eyebrow("A little recap"),
            e(
              "div",
              { className: "summary-line" },
              e("span", null, "Subtotal"),
              e("span", null, `₹${subtotal}.00`),
            ),
            e("p", null, "Shipping and taxes are calculated at checkout."),
            e(
              "button",
              {
                className: "button button-dark checkout-button",
                type: "button",
                onClick: () =>
                  window.alert(
                    "Checkout is coming soon. Your bag is saved right here.",
                  ),
              },
              "Continue to checkout ",
              e("span", { "aria-hidden": true }, "↗"),
            ),
            e(
              Link,
              { className: "continue-shopping", to: "/products" },
              "Keep looking around",
            ),
          ),
        ),
  );
}

function App() {
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef(null);
  const [cart, setCart] = useState(() => {
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
  });
  const location = useLocation();
  const cartCount = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0,
  );
  useEffect(() => {
    try {
      localStorage.setItem("prodexa-cart", JSON.stringify(cart));
    } catch {
        
      /* Storage may be unavailable in private browsing. */
    }
  }, [cart]);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);
  useEffect(() => {
    if (location.hash)
      document
        .getElementById(location.hash.slice(1))
        ?.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);
  function addToCart(id) {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    setToastMessage(`${product.name} added to bag`);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMessage(""), 2400);
  }
  function changeQuantity(id, quantity) {
    setCart((current) => {
      if (quantity < 1) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      return { ...current, [id]: quantity };
    });
  }
  function removeFromCart(id) {
    setCart((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }
  return e(
    React.Fragment,
    null,
    e(Navbar, { cartCount }),
    e(
      Routes,
      null,
      e(Route, { path: "/", element: e(Home, { onAdd: addToCart }) }),
      e(Route, {
        path: "/products",
        element: e(Catalog, { onAdd: addToCart }),
      }),
      e(Route, {
        path: "/products/:id",
        element: e(ProductDetail, { onAdd: addToCart }),
      }),
      e(Route, {
        path: "/cart",
        element: e(Cart, {
          cart,
          onQuantityChange: changeQuantity,
          onRemove: removeFromCart,
        }),
      }),
      e(Route, {
        path: "*",
        element: e(
          "main",
          { className: "not-found content-width" },
          eyebrow("404 / Lost in the shop"),
          e("h1", null, "This page wandered off."),
          e(
            Link,
            { className: "text-link", to: "/" },
            "Back to the good stuff ↗",
          ),
        ),
      }),
    ),
    toastMessage
      ? e(
          "div",
          {
            className: "cart-toast",
            role: "status",
            "aria-live": "polite",
          },
          e("span", { className: "cart-toast-icon", "aria-hidden": true }, "✓"),
          e("span", null, toastMessage),
        )
      : null,
    e(
      "footer",
      { className: "site-footer" },
      e(Link, { className: "wordmark", to: "/" }, "Prodexa"),
      e("p", null, "Everyday essentials, made to last."),
      e("span", null, "© Prodexa 2026"),
    ),
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  e(HashRouter, null, e(App)),
);
