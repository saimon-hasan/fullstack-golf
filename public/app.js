const main = document.querySelector("main");
const dialog = document.querySelector("dialog");
const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let products = [],
  favorites = [],
  bag = [],
  user = null,
  toastTimer,
  lastFocus,
  previousHash = "#home";
function read(key, fallback) {
  try {
    return JSON.parse(sessionStorage.getItem("cavoon." + key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function save() {
  try {
    sessionStorage.setItem("cavoon.favorites", JSON.stringify(favorites));
    sessionStorage.setItem("cavoon.bag", JSON.stringify(bag));
    sessionStorage.setItem("cavoon.user", JSON.stringify(user));
  } catch {
    toast("Browser storage is unavailable. Changes last until you reload.");
  }
  counts();
}
function counts() {
  document.querySelector("#fav-count").textContent = favorites.length;
  document.querySelector("#bag-count").textContent = bag.reduce(
    (s, x) => s + x.qty,
    0,
  );
  document.querySelector("#account-link").textContent = user
    ? "Account"
    : "Sign in";
}
function toast(message) {
  const t = document.querySelector("#toast");
  t.textContent = message;
  t.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("visible"), 3200);
}
function card(p) {
  return `<article class="product"><div class="product-image"><a href="#product/${p.id}" aria-label="View ${esc(p.name)}"><img src="${p.image}" alt="${esc(p.name)} — illustrative clothing photo" loading="lazy"></a><span class="badge">NEW SEASON</span><button class="heart" data-favorite="${p.id}" aria-label="${favorites.includes(p.id) ? "Unsave" : "Save"} ${esc(p.name)}" aria-pressed="${favorites.includes(p.id)}">${favorites.includes(p.id) ? "♥" : "♡"}</button></div><div class="meta"><h3><a href="#product/${p.id}">${esc(p.name)}</a></h3><b>${money(p.price)}</b></div><p>${esc(p.color)} · XS–XL</p></article>`;
}
function empty(
  title,
  text,
  link = "#shop/all",
  label = "Explore the collection",
) {
  return `<div class="empty"><h2>${title}</h2><p>${text}</p><a class="btn" href="${link}">${label} ↗</a></div>`;
}
function home() {
  main.innerHTML = `<section class="hero"><div class="hero-copy"><p class="eyebrow">THE EVERYDAY EDIT / AUTUMN 2026</p><h1>A little less.<br>A lot more<br><em>you.</em></h1><p>Easy layers. Quiet confidence.<br>Meet the pieces you’ll make your own.</p><a class="btn" href="#shop/all">Shop new arrivals <span>↗</span></a></div><div class="hero-image"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=90" alt="Woman wearing sunglasses and carrying shopping bags" fetchpriority="high"><span class="image-tag">YOUR EVERYDAY. REIMAGINED.</span></div></section><div class="strip"><span>01 — CONSIDERED STYLE</span><span>02 — EVERYDAY POSSIBILITIES</span><span>03 — ALWAYS YOUR OWN</span></div><section class="section"><div class="heading-row"><div><p class="eyebrow">FRESH INTO THE ROTATION</p><h2>Meet your new essentials.</h2></div><a class="text-link" href="#shop/all">View all pieces ↗</a></div><div class="grid">${products.slice(0, 4).map(card).join("")}</div></section><section class="editorial"><img src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=85" alt="A curated rail of everyday clothing" loading="lazy"><div><p class="eyebrow">THE ART OF GETTING DRESSED</p><h2>Less effort.<br>More expression.</h2><p>Build a wardrobe that moves with you. Start with a good essential. Make the rest your own.</p><a class="text-link" href="#shop/men">Explore menswear ↗</a></div></section>`;
}
let filter = { search: "", category: "all", sort: "featured" };
function shop(gender = "all") {
  if (!["all", "women", "men"].includes(gender)) gender = "all";
  main.innerHTML = `<section class="page-title"><p class="eyebrow">THE CAVOON COLLECTION</p><h1>${gender === "all" ? "New arrivals" : gender === "women" ? "The women’s edit" : "The men’s edit"}</h1><p>Considered pieces. Countless ways to wear them.</p></section><div class="shop-layout"><aside class="filters" aria-label="Product filters"><div class="filter-tabs">${["all", "women", "men"].map((g) => `<a class="${g === gender ? "active" : ""}" href="#shop/${g}">${g === "all" ? "All pieces" : g === "women" ? "Women" : "Men"}</a>`).join("")}</div><label for="search">SEARCH THE COLLECTION</label><input id="search" type="search" placeholder="Try ‘denim’" value="${esc(filter.search)}"><label for="category">CATEGORY</label><select id="category"><option value="all">All categories</option>${[...new Set(products.filter((p) => gender === "all" || p.gender === gender).map((p) => p.category))].map((c) => `<option ${filter.category === c ? "selected" : ""}>${c}</option>`).join("")}</select><button class="remove" id="reset-filters">Reset filters</button></aside><section aria-label="Products"><div class="results-top"><span id="result-count" role="status"></span><label for="sort" hidden>Sort products</label><select id="sort" aria-label="Sort products"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div><div class="grid" id="results"></div></section></div>`;
  const update = () => {
    let list = products.filter(
      (p) =>
        (gender === "all" || p.gender === gender) &&
        (filter.category === "all" || p.category === filter.category) &&
        `${p.name} ${p.color} ${p.category}`
          .toLowerCase()
          .includes(filter.search.toLowerCase()),
    );
    if (filter.sort !== "featured")
      list.sort((a, b) =>
        filter.sort === "low" ? a.price - b.price : b.price - a.price,
      );
    document.querySelector("#result-count").textContent =
      `${list.length} pieces`;
    document.querySelector("#results").innerHTML = list.length
      ? list.map(card).join("")
      : empty(
          "Nothing here just yet.",
          "Try another search or reset your filters.",
        );
  };
  document.querySelector("#sort").value = filter.sort;
  document.querySelector("#search").oninput = (e) => {
    filter.search = e.target.value;
    update();
  };
  document.querySelector("#category").onchange = (e) => {
    filter.category = e.target.value;
    update();
  };
  document.querySelector("#sort").onchange = (e) => {
    filter.sort = e.target.value;
    update();
  };
  document.querySelector("#reset-filters").onclick = () => {
    filter = { search: "", category: "all", sort: "featured" };
    shop(gender);
  };
  update();
}
function saved() {
  main.innerHTML = `<section class="page-title"><p class="eyebrow">KEEP WHAT SPEAKS TO YOU</p><h1>Your favorites.</h1><p>A little inspiration for your next look.</p></section><section class="section" style="padding-top:0"><div class="grid">${
    favorites.length
      ? products
          .filter((p) => favorites.includes(p.id))
          .map(card)
          .join("")
      : empty(
          "Your next favorite is out there.",
          "Tap the heart on any piece to save it here.",
        )
  }</div></section>`;
}
function account() {
  if (user) {
    main.innerHTML = `<section class="account"><p class="eyebrow">YOUR CAVOON SPACE</p><h2 id="welcome"></h2><p>This is your demo session for this browser tab.</p><dl><dt>Status</dt><dd>Demo signed in</dd><dt>Username</dt><dd id="session-user"></dd><dt>Saved pieces</dt><dd>${favorites.length}</dd><dt>Items in bag</dt><dd>${bag.reduce((s, x) => s + x.qty, 0)}</dd></dl><button class="btn" id="logout">Sign out</button> <a class="text-link" href="#shop/all">Back to the collection ↗</a></section>`;
    document.querySelector("#welcome").textContent = `Welcome, ${user.name}.`;
    document.querySelector("#session-user").textContent = user.name;
    document.querySelector("#logout").onclick = () => {
      user = null;
      save();
      account();
      toast("You’re signed out.");
    };
    return;
  }
  main.innerHTML = `<section class="auth-wrap"><div class="auth-photo" role="img" aria-label="Fashion shopping inspiration"></div><div class="auth-panel"><p class="eyebrow">A SPACE FOR YOUR STYLE</p><h1>Welcome<br>to CAVOON.</h1><p>Save what you love. Build your next look.</p><p class="hint">Demo access: choose any username and use password <strong>cavoon123</strong>. No real account is created.</p><form id="login-form"><label for="username">Username</label><input id="username" name="username" autocomplete="username" maxlength="40" required><label for="password">Demo password</label><input id="password" name="password" type="password" autocomplete="off" required><button type="button" class="remove" id="show-password" aria-pressed="false">Show password</button><p class="error" id="login-error" role="alert"></p><button class="btn">Sign in ↗</button></form><p><a class="text-link" href="#shop/all">Continue as a guest</a></p></div></section>`;
  document.querySelector("#show-password").onclick = (e) => {
    const input = document.querySelector("#password");
    input.type = input.type === "password" ? "text" : "password";
    e.target.textContent =
      input.type === "password" ? "Show password" : "Hide password";
    e.target.setAttribute("aria-pressed", input.type === "text");
  };
  document.querySelector("#login-form").onsubmit = (e) => {
    e.preventDefault();
    const name = document.querySelector("#username").value.trim();
    if (!name || document.querySelector("#password").value !== "cavoon123") {
      document.querySelector("#login-error").textContent =
        "Enter a username and the demo password cavoon123.";
      return;
    }
    user = { name };
    save();
    location.hash = "shop/all";
    toast("Welcome to CAVOON.");
  };
}
function bagPage() {
  if (!bag.length) {
    main.innerHTML = `<section class="section">${empty("A little room for something good.", "Your shopping bag is empty.")}</section>`;
    return;
  }
  let total = bag.reduce(
    (s, x) => s + products.find((p) => p.id === x.id).price * x.qty,
    0,
  );
  main.innerHTML = `<section class="page-title"><p class="eyebrow">YOUR NEXT EVERYDAY FAVORITES</p><h1>Your shopping bag.</h1></section><div class="bag-layout"><section aria-label="Bag items">${bag
    .map((x, i) => {
      const p = products.find((p) => p.id === x.id);
      return `<article class="bag-item"><img src="${p.image}" alt="${esc(p.name)}"><div><h3>${p.name}</h3><p>${p.color} / Size ${x.size}</p><div class="quantity"><button data-qty="${i}" data-change="-1" aria-label="Decrease quantity of ${p.name}" ${x.qty === 1 ? "disabled" : ""}>−</button><span>${x.qty}</span><button data-qty="${i}" data-change="1" aria-label="Increase quantity of ${p.name}" ${x.qty === 10 ? "disabled" : ""}>+</button></div><button class="remove" data-remove="${i}">Remove</button></div><b>${money(p.price * x.qty)}</b></article>`;
    })
    .join(
      "",
    )}</section><aside class="summary"><h2>Order summary</h2><p><span>Subtotal</span><span>${money(total)}</span></p><p><span>Demo delivery</span><span>Free</span></p><p class="total"><span>Demo total</span><span>${money(total)}</span></p><button class="btn" id="checkout">Complete demo order ↗</button><p class="disclaimer">Simulation only. No payment, shipping address, or real order. Prices are sample USD prices.</p></aside></div>`;
  document.querySelector("#checkout").onclick = () => {
    bag = [];
    save();
    location.hash = "complete";
  };
}
function detail(id) {
  const p = products.find((p) => p.id === id);
  if (!p) {
    main.innerHTML = empty(
      "Piece not found.",
      "Explore the rest of the collection.",
    );
    return;
  }
  if (!main.innerHTML) home();
  lastFocus = document.activeElement;
  dialog.innerHTML = `<button class="close-dialog" aria-label="Close product details">×</button><div class="detail"><img src="${p.image}" alt="${p.name}"><div class="detail-info"><p class="eyebrow">CAVOON / ${p.category}</p><h2>${p.name}</h2><h3>${money(p.price)}</h3><p>${p.description}</p><p>Color: ${p.color}</p><form id="add-form"><label for="size">Select your size</label><select id="size" required><option value="">Choose a size</option>${p.sizes.map((s) => `<option>${s}</option>`).join("")}</select><button class="btn">Add to bag ↗</button></form><button class="remove" data-favorite="${p.id}">${favorites.includes(p.id) ? "Remove from" : "Add to"} favorites</button><p style="font-size:11px">Demo product · Illustrative photography</p></div></div>`;
  if (!dialog.open) dialog.showModal();
  dialog.querySelector(".close-dialog").onclick = () => dialog.close();
  dialog.querySelector("#add-form").onsubmit = (e) => {
    e.preventDefault();
    const size = dialog.querySelector("#size").value;
    const item = bag.find((x) => x.id === id && x.size === size);
    if (item && item.qty >= 10) {
      toast("Maximum 10 per size in the demo bag.");
      return;
    }
    if (item) item.qty++;
    else bag.push({ id, size, qty: 1 });
    save();
    dialog.close();
    toast(`${p.name} added to your bag.`);
  };
}
dialog.addEventListener("close", () => {
  if (location.hash.startsWith("#product/"))
    history.replaceState(null, "", previousHash);
  if (lastFocus?.isConnected) lastFocus.focus();
});
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});
document.addEventListener("click", (e) => {
  const fav = e.target.closest("[data-favorite]");
  if (fav) {
    const id = fav.dataset.favorite;
    const index = favorites.indexOf(id);
    if (index >= 0) favorites.splice(index, 1);
    else favorites.push(id);
    save();
    document.querySelectorAll(`[data-favorite="${id}"]`).forEach((b) => {
      if (b.classList.contains("heart")) {
        b.textContent = favorites.includes(id) ? "♥" : "♡";
        b.setAttribute("aria-pressed", favorites.includes(id));
        b.setAttribute(
          "aria-label",
          `${favorites.includes(id) ? "Unsave" : "Save"} ${products.find((p) => p.id === id).name}`,
        );
      } else
        b.textContent =
          (favorites.includes(id) ? "Remove from" : "Add to") + " favorites";
    });
    if (location.hash === "#favorites") saved();
    toast(index >= 0 ? "Removed from favorites." : "Saved to your favorites.");
  }
  const q = e.target.closest("[data-qty]");
  if (q) {
    const x = bag[Number(q.dataset.qty)];
    x.qty = Math.max(1, Math.min(10, x.qty + Number(q.dataset.change)));
    save();
    bagPage();
  }
  const r = e.target.closest("[data-remove]");
  if (r) {
    bag.splice(Number(r.dataset.remove), 1);
    save();
    bagPage();
    toast("Item removed from your bag.");
  }
});
function route() {
  const [page, arg] = (
    location.hash.slice(1) ||
    (location.pathname === "/login.html" ? "account" : "home")
  ).split("/");
  if (page === "product") {
    detail(arg);
    return;
  }
  previousHash = location.hash || "#home";
  if (dialog.open) dialog.close();
  if (page === "shop") {
    filter = { search: "", category: "all", sort: "featured" };
    shop(arg);
  } else if (page === "favorites") saved();
  else if (page === "account") account();
  else if (page === "bag") bagPage();
  else if (page === "complete")
    main.innerHTML = `<section class="confirmation"><p class="eyebrow">THE DEMO IS COMPLETE</p><h1>Good choices.<br>Great style.</h1><p>Your simulated checkout is complete and your bag has been cleared. No payment was taken and no real order was placed.</p><a class="btn" href="#shop/all">Keep exploring ↗</a></section>`;
  else home();
  window.scrollTo(0, 0);
  document.title = `${page === "home" ? "Wear your own way" : page === "shop" ? "The collection" : page === "account" ? "Your account" : page === "bag" ? "Shopping bag" : page === "favorites" ? "Favorites" : "CAVOON"} | CAVOON`;
}
async function init() {
  main.innerHTML = '<p class="loading">Opening the collection…</p>';
  try {
    const response = await fetch("/products.json");
    if (!response.ok) throw Error();
    products = await response.json();
    const ids = new Set(products.map((p) => p.id));
    let f = read("favorites", []);
    favorites = Array.isArray(f)
      ? [...new Set(f.filter((id) => ids.has(id)))]
      : [];
    let b = read("bag", []);
    bag = Array.isArray(b)
      ? b.filter(
          (x) =>
            x &&
            ids.has(x.id) &&
            products.find((p) => p.id === x.id).sizes.includes(x.size) &&
            Number.isInteger(x.qty) &&
            x.qty > 0 &&
            x.qty <= 10,
        )
      : [];
    let u = read("user", null);
    user =
      u && typeof u.name === "string" ? { name: u.name.slice(0, 40) } : null;
    counts();
    route();
    window.addEventListener("hashchange", route);
  } catch {
    main.innerHTML = empty(
      "The collection couldn’t load.",
      "Please refresh the page to try again.",
      "#home",
      "Back home",
    );
  }
}
init();
