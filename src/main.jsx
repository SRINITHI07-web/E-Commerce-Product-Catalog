import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import products from "../product.js";
import "../style.css";

const pageTitle = "Prodexa — Everyday essentials, made to last";
const categories = ["All", ...new Set(products.map((product) => product.category))];
const ourWayImage =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=82";

function readCart() {
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

function readLocation() {
  const fragment = decodeURIComponent(window.location.hash.slice(1));
  if (!fragment) return { path: "/", anchor: "" };
  if (!fragment.startsWith("/")) return { path: "/", anchor: fragment };

  const [path, anchor = ""] = fragment.split("#");
  return { path: path.replace(/\/$/, "") || "/", anchor };
}

function useLocation() {
  const [location, setLocation] = useState(readLocation);

  useEffect(() => {
    const updateLocation = () => setLocation(readLocation());
    window.addEventListener("hashchange", updateLocation);
    return () => window.removeEventListener("hashchange", updateLocation);
  }, []);

  useEffect(() => {
    if (location.anchor) {
      requestAnimationFrame(() =>
        document
          .getElementById(location.anchor)
          ?.scrollIntoView({ behavior: "smooth" }),
      );
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return location;
}

function imageSet(url) {
  return `${url.replace("w=1000", "w=480")} 480w, ${url.replace("w=1000", "w=800")} 800w, ${url.replace("w=1000", "w=1200")} 1200w`;
}

function Eyebrow({ children, className = "" }) {
  return <span className={`eyebrow ${className}`}>{children}</span>;
}

function Navbar({ path, itemCount, onSearchClick }) {
  return (
    <header className="site-header">
      <a className="brand-lockup" href="#/" aria-label="Prodexa home">
        <span className="brand-mark">P</span>
        <span className="wordmark">Prodexa</span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        <a
          href="#/products"
          aria-current={path.startsWith("/products") ? "page" : undefined}
        >
          Shop
        </a>
        <a href="#/our-way" aria-current={path === "/our-way" ? "page" : undefined}>
          Our way
        </a>
        <a href="#/login" aria-current={path === "/login" ? "page" : undefined}>
          Sign in
        </a>
      </nav>
      <div className="header-actions">
        <a
          className="icon-link search-link"
          href="#/products"
          aria-label="Search products"
          title="Search products"
          onClick={onSearchClick}
        >
          ⌕
        </a>
        <a
          className="cart-link"
          href="#/cart"
          aria-label={`Shopping bag, ${itemCount} items`}
        >
          <span>Bag</span>
          <span className="cart-count">{itemCount}</span>
        </a>
      </div>
    </header>
  );
}

function ProductCard({ product }) {
  const productUrl = `#/products/${encodeURIComponent(product.id)}`;
  return (
    <article className="product-card">
      <a
        className="product-image-link"
        href={productUrl}
        aria-label={`View ${product.name}`}
      >
        <div className="product-image-wrap">
          <img
            src={product.image}
            srcSet={imageSet(product.image)}
            sizes="(max-width: 600px) 46vw, (max-width: 900px) 44vw, 24vw"
            alt={product.alt}
            loading="lazy"
            width="800"
            height="1000"
          />
        </div>
      </a>
      <div className="product-meta">
        <div>
          <a className="product-name" href={productUrl}>
            {product.name}
          </a>
          <p>
            {product.category} · {product.color}
          </p>
        </div>
        <span className="product-price">₹{product.price}</span>
      </div>
    </article>
  );
}

function Catalog({ category, onCategoryChange, query, onQueryChange, sort, onSortChange }) {
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products
      .filter((product) => {
        const matchesCategory =
          category === "All" || product.category === category;
        const matchesQuery =
          `${product.name} ${product.category} ${product.color}`
            .toLowerCase()
            .includes(normalizedQuery);
        return matchesCategory && matchesQuery;
      })
      .sort((first, second) => {
        if (sort === "price-low") return first.price - second.price;
        if (sort === "price-high") return second.price - first.price;
        if (sort === "name") return first.name.localeCompare(second.name);
        return products.indexOf(first) - products.indexOf(second);
      });
  }, [category, query, sort]);

  return (
    <main className="catalog-page content-width">
      <section className="catalog-intro">
        <Eyebrow>New season</Eyebrow>
        <h1>
          Everyday essentials,
          <br />
          made to last.
        </h1>
        <p>
          Thoughtfully designed goods for the home and the road. Free shipping
          over ₹100.
        </p>
      </section>
      <label className="search-box catalog-search">
        <span aria-hidden="true">⌕</span>
        <input
          id="product-search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search products"
          aria-label="Search products"
        />
      </label>
      <div className="category-tabs" role="group" aria-label="Filter by category">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={`category-tab${category === item ? " active" : ""}`}
            onClick={() => onCategoryChange(item)}
            aria-pressed={category === item}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="catalog-toolbar">
        <p className="result-count" aria-live="polite">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </p>
        <label className="sort-control">
          Sort:
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
      </div>
      <div className="product-grid">
        {filteredProducts.length ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="empty-results">
            Nothing here just yet. Try another search.
          </p>
        )}
      </div>
    </main>
  );
}

function Spotlight({ product, onAdd }) {
  return (
    <section className="spotlight content-width" id="our-way">
      <div className="spotlight-image">
        <img
          src={product.image}
          alt={product.alt}
          loading="lazy"
          width="1000"
          height="800"
        />
      </div>
      <div className="spotlight-copy">
        <Eyebrow>Bestseller</Eyebrow>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <div className="spotlight-actions">
          <a className="text-link" href={`#/products/${product.id}`}>
            ₹{product.price} · View details
          </a>
          <button
            className="spotlight-add"
            type="button"
            onClick={() => onAdd(product)}
          >
            Add to bag <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function ProductDetail({ product, onAdd }) {
  if (!product) {
    return (
      <main className="not-found content-width">
        <Eyebrow>Well, this is awkward</Eyebrow>
        <h1>We couldn’t find that one.</h1>
        <a className="text-link" href="#/products">
          Back to the collection ↗
        </a>
      </main>
    );
  }

  return (
    <main className="detail-page content-width">
      <a className="back-link" href="#/products">
        ← All objects
      </a>
      <div className="detail-layout">
        <div className="detail-image">
          <img
            src={product.image}
            srcSet={imageSet(product.image)}
            sizes="(max-width: 600px) 92vw, 52vw"
            alt={product.alt}
            width="1200"
            height="1500"
            fetchPriority="high"
          />
        </div>
        <div className="detail-info">
          <Eyebrow>
            {product.category} / {product.label}
          </Eyebrow>
          <h1>{product.name}</h1>
          <p className="detail-price">₹{product.price}.00</p>
          <p className="detail-description">{product.description}</p>
          <p className="detail-color">
            <span>Color</span>
            {product.color}
          </p>
          <button
            className="button button-dark add-detail"
            type="button"
            onClick={() => onAdd(product)}
          >
            Add to bag <span>₹{product.price}.00</span>
          </button>
          <p className="shipping-note">
            Complimentary shipping on orders over ₹100.
          </p>
          <div className="detail-perks">
            <p>
              <span>01</span>Made with care, meant to last
            </p>
            <p>
              <span>02</span>Considered materials, always
            </p>
            <p>
              <span>03</span>Easy returns within 30 days
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Cart({ cart, onChangeQuantity, onRemove }) {
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

  return (
    <main className="cart-page content-width">
      <div className="cart-heading">
        <Eyebrow>Your good things</Eyebrow>
        <h1>
          Your bag<span>.</span>
        </h1>
      </div>
      {entries.length ? (
        <div className="cart-layout">
          <div className="cart-items">
            {entries.map(({ product, quantity }) => (
              <article className="cart-item" key={product.id}>
                <a
                  href={`#/products/${product.id}`}
                  className="cart-item-image"
                >
                  <img
                    src={product.image}
                    alt={product.alt}
                    width="300"
                    height="360"
                  />
                </a>
                <div className="cart-item-info">
                  <a
                    href={`#/products/${product.id}`}
                    className="product-name"
                  >
                    {product.name}
                  </a>
                  <p>{product.color}</p>
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => onChangeQuantity(product.id, -1)}
                      aria-label={`Decrease ${product.name} quantity`}
                    >
                      −
                    </button>
                    <span>{quantity}</span>
                    <button
                      type="button"
                      onClick={() => onChangeQuantity(product.id, 1)}
                      aria-label={`Increase ${product.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-item"
                    type="button"
                    onClick={() => onRemove(product.id)}
                  >
                    Remove
                  </button>
                </div>
                <span className="cart-item-price">
                  ₹{product.price * quantity}.00
                </span>
              </article>
            ))}
          </div>
          <aside className="order-summary">
            <Eyebrow>A little recap</Eyebrow>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>₹{subtotal}.00</span>
            </div>
            <p>Shipping and taxes are calculated at checkout.</p>
            <button
              className="button button-dark checkout-button"
              type="button"
              onClick={() =>
                window.alert(
                  "Checkout is coming soon. Your bag is saved right here.",
                )
              }
            >
              Continue to checkout <span aria-hidden="true">↗</span>
            </button>
            <a className="continue-shopping" href="#/products">
              Keep looking around
            </a>
          </aside>
        </div>
      ) : (
        <div className="empty-cart">
          <p>Your bag is taking a quiet moment.</p>
          <a className="button button-dark" href="#/products">
            Explore the collection <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
    </main>
  );
}

function NotFound() {
  return (
    <main className="not-found content-width">
      <Eyebrow>404 / Lost in the shop</Eyebrow>
      <h1>This page wandered off.</h1>
      <a className="text-link" href="#/">
        Back to the good stuff ↗
      </a>
    </main>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <a className="wordmark" href="#/">
        Prodexa
      </a>
      <p>Everyday essentials, made to last.</p>
      <a className="support-link" href="mailto:srinithi.webdev@gmail.com">
        Contact: srinithi.webdev@gmail.com
      </a>
      <span>© Prodexa 2026</span>
    </footer>
  );
}

function OurWay() {
  return (
    <main className="our-way-page">
      <section className="our-way-hero">
        <img
          src={ourWayImage}
          alt="A calm, lived-in home with natural textures"
          fetchPriority="high"
        />
        <div className="our-way-hero-shade" />
        <div className="our-way-hero-copy content-width">
          <Eyebrow>Our way</Eyebrow>
          <h1>Good things earn their place.</h1>
          <p>Everyday objects, chosen for how they work and how they feel to live with.</p>
        </div>
      </section>
      <section className="our-way-intro content-width">
        <Eyebrow>A little less, a little better</Eyebrow>
        <h2>Choose the things that make every day feel more like yours.</h2>
        <p>
          Prodexa brings together thoughtful pieces for home and away. We look
          for honest materials, considered details, and designs that feel at
          home in everyday life.
        </p>
      </section>
      <blockquote className="our-way-quote content-width">
        <p>“The best pieces become part of the way we live.”</p>
        <cite>The Prodexa point of view</cite>
      </blockquote>
      <section className="our-way-values content-width" aria-label="Our values">
        <article>
          <span>01</span>
          <h3>Made for everyday</h3>
          <p>Practical pieces should feel just as good to use as they look on a shelf.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Details with a reason</h3>
          <p>We value thoughtful shapes, useful materials, and the small things done well.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Keep what you love</h3>
          <p>We choose enduring styles that can become part of your routine for years.</p>
        </article>
      </section>
      <section className="our-way-cta">
        <Eyebrow>Find your everyday</Eyebrow>
        <h2>Objects worth coming back to.</h2>
        <a className="button button-dark" href="#/products">
          Explore the collection <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  );
}

function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const [feedback, setFeedback] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    let profiles = {};

    try {
      const storedProfiles = JSON.parse(
        localStorage.getItem("prodexa-demo-profiles") || "{}",
      );
      if (
        storedProfiles &&
        typeof storedProfiles === "object" &&
        !Array.isArray(storedProfiles)
      ) {
        profiles = storedProfiles;
      }
    } catch {
      setFeedback("Browser storage is unavailable, so this demo profile can’t be saved or checked.");
      return;
    }

    if (isRegister) {
      const name = String(formData.get("name") || "").trim();
      profiles[email] = { name, email };
      try {
        localStorage.setItem("prodexa-demo-profiles", JSON.stringify(profiles));
        setFeedback(`Profile saved in this browser for ${name}. Your password was not saved.`);
      } catch {
        setFeedback("Browser storage is unavailable, so this demo profile could not be saved.");
      }
      return;
    }

    const profile = profiles[email];
    setFeedback(
      profile
        ? `Demo profile found for ${profile.name || profile.email}. Passwords aren’t checked.`
        : "No saved demo profile was found for this email in this browser. Create one first.",
    );
  }

  return (
    <main className="auth-page content-width">
      <aside className="auth-aside">
        <Eyebrow>{isRegister ? "Make yourself at home" : "Welcome back"}</Eyebrow>
        <div>
          <h1>{isRegister ? "A place for your good things." : "Good to see you again."}</h1>
          <p>Sign in to keep your Prodexa experience close at hand.</p>
        </div>
        <a className="auth-aside-link" href="#/products">Browse the collection <span aria-hidden="true">↗</span></a>
      </aside>
      <section className="auth-panel" aria-labelledby="auth-title">
        <Eyebrow>{isRegister ? "Create an account" : "Your account"}</Eyebrow>
        <h2 id="auth-title">{isRegister ? "Join Prodexa" : "Sign in"}</h2>
        <p className="auth-description">
          {isRegister
            ? "Create an account to make your next visit feel familiar."
            : "Enter your details to continue."}
        </p>
        <p className="auth-demo-note">
          Demo profiles save your name and email in this browser only. Passwords are never saved or checked.
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Name
              <input name="name" autoComplete="name" required />
            </label>
          )}
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={6}
              required
            />
          </label>
          {feedback && (
            <p className="auth-feedback" role="status">{feedback}</p>
          )}
          <button className="button button-dark auth-submit" type="submit">
            {isRegister ? "Create account" : "Sign in"}
            <span aria-hidden="true">↗</span>
          </button>
        </form>
        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "New to Prodexa?"}{" "}
          <a href={isRegister ? "#/login" : "#/register"}>
            {isRegister ? "Sign in" : "Create an account"}
          </a>
        </p>
      </section>
    </main>
  );
}

function App() {
  const { path } = useLocation();
  const [cart, setCart] = useState(readCart);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [toast, setToast] = useState("");
  const [searchFocusRequested, setSearchFocusRequested] = useState(false);
  const toastTimer = useRef(null);
  const itemCount = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0,
  );
  const detailProduct = path.startsWith("/products/")
    ? products.find((product) => product.id === path.slice("/products/".length))
    : null;

  useEffect(() => {
    if (!searchFocusRequested || (path !== "/" && path !== "/products")) return;
    document.getElementById("product-search")?.focus();
    setSearchFocusRequested(false);
  }, [path, searchFocusRequested]);

  useEffect(() => {
    try {
      localStorage.setItem("prodexa-cart", JSON.stringify(cart));
    } catch {
      // Browser storage can be unavailable in private browsing.
    }
  }, [cart]);

  useEffect(() => {
    document.title = detailProduct
      ? `${detailProduct.name} — Prodexa`
      : path === "/our-way"
        ? "Our way — Prodexa"
        : path === "/login"
          ? "Sign in — Prodexa"
          : path === "/register"
            ? "Create an account — Prodexa"
            : pageTitle;
    document.getElementById("product-structured-data")?.remove();

    if (detailProduct) {
      const structuredData = document.createElement("script");
      structuredData.id = "product-structured-data";
      structuredData.type = "application/ld+json";
      structuredData.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: detailProduct.name,
        description: detailProduct.description,
        image: detailProduct.image,
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: detailProduct.price,
          availability: "https://schema.org/InStock",
        },
      });
      document.head.append(structuredData);
    }
  }, [detailProduct, path]);

  useEffect(
    () => () => {
      window.clearTimeout(toastTimer.current);
      document.getElementById("product-structured-data")?.remove();
      document.title = pageTitle;
    },
    [],
  );

  function addToCart(product) {
    setCart((currentCart) => ({
      ...currentCart,
      [product.id]: (currentCart[product.id] || 0) + 1,
    }));
    setToast(`${product.name} added to bag`);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2400);
  }

  function changeQuantity(id, delta) {
    setCart((currentCart) => {
      const nextQuantity = (currentCart[id] || 0) + delta;
      const nextCart = { ...currentCart };
      if (nextQuantity < 1) delete nextCart[id];
      else nextCart[id] = nextQuantity;
      return nextCart;
    });
  }

  let content;
  if (path === "/" || path === "/products") {
    content = (
      <>
        <Catalog
          category={category}
          onCategoryChange={setCategory}
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
        />
        {path === "/" && (
          <Spotlight product={products[0]} onAdd={addToCart} />
        )}
      </>
    );
  } else if (path.startsWith("/products/")) {
    content = <ProductDetail product={detailProduct} onAdd={addToCart} />;
  } else if (path === "/cart") {
    content = (
      <Cart
        cart={cart}
        onChangeQuantity={changeQuantity}
        onRemove={(id) =>
          setCart((currentCart) => {
            const nextCart = { ...currentCart };
            delete nextCart[id];
            return nextCart;
          })
        }
      />
    );
  } else if (path === "/our-way") {
    content = <OurWay />;
  } else if (path === "/login" || path === "/register") {
    content = <AuthPage key={path} mode={path.slice(1)} />;
  } else {
    content = <NotFound />;
  }

  return (
    <>
      <Navbar
        path={path}
        itemCount={itemCount}
        onSearchClick={() => setSearchFocusRequested(true)}
      />
      {content}
      <div className="toast-host" aria-live="polite">
        {toast && (
          <div className="cart-toast" role="status">
            <span className="cart-toast-icon" aria-hidden="true">
              ✓
            </span>
            <span>{toast}</span>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
