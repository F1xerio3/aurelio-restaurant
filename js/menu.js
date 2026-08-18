(function () {
  "use strict";

  var DATA = window.AURELIO_DATA;
  var DISHES = DATA.DISHES;
  var IMG_BASE = DATA.IMG_BASE;
  var CATEGORY_NAMES = DATA.CATEGORY_NAMES;
  var PER_PAGE = 8;

  var CATEGORIES = [
    { id: "all", name: "Все блюда", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>' },
    { id: "starters", name: "Закуски", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M4 12l3-3m-3 3 3 3"/><path d="M8 5h13a1 1 0 0 1 1 1v5H8a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/></svg>' },
    { id: "salads", name: "Салаты", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21C7 17 4 13.5 4 9.5A5.5 5.5 0 0 1 12 7a5.5 5.5 0 0 1 8 2.5C20 13.5 17 17 12 21z"/></svg>' },
    { id: "soups", name: "Супы", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M5 11V7a2 2 0 0 1 4 0M12 11V7a2 2 0 0 1 4 0M19 11V7a2 2 0 0 1 1-1.9"/></svg>' },
    { id: "mains", name: "Основные блюда", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M8 3v4M16 3v4"/></svg>' },
    { id: "desserts", name: "Десерты", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18h16l-1-7a4 4 0 0 0-4-3H9a4 4 0 0 0-4 3z"/><path d="M9 8V5m6 3V5M12 5V3"/></svg>' },
    { id: "drinks", name: "Напитки", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v6a6 6 0 0 1-12 0z"/><path d="M6 13h12v2a6 6 0 0 1-6 6 6 6 0 0 1-6-6z"/></svg>' },
    { id: "wine", name: "Вино", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10v4a5 5 0 0 1-10 0z"/><path d="M12 12v7M8 21h8"/></svg>' }
  ];

  var PRICE_OPTIONS = [
    { value: "all", label: "Любая цена" },
    { value: "0-1000", label: "До 1 000 ₽" },
    { value: "1000-2000", label: "1 000 – 2 000 ₽" },
    { value: "2000-3000", label: "2 000 – 3 000 ₽" },
    { value: "3000-", label: "От 3 000 ₽" }
  ];

  var SORT_OPTIONS = [
    { value: "popular", label: "По популярности" },
    { value: "priceAsc", label: "По цене ↑" },
    { value: "priceDesc", label: "По цене ↓" },
    { value: "new", label: "Новинки" }
  ];

  var CHEVRON_SVG =
    '<svg class="dd__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

  var HEART_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21C7 17 4 13.5 4 9.5A5.5 5.5 0 0 1 12 7a5.5 5.5 0 0 1 8 2.5C20 13.5 17 17 12 21z"/></svg>';
  var PLUS_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';

  var STORE = window.AURELIO_STORE;

  var state = {
    category: "all",
    price: "all",
    features: [],
    sort: "popular",
    visible: PER_PAGE
  };

  var catalog = document.getElementById("catalog");
  var resultsCount = document.getElementById("resultsCount");
  var loadMore = document.getElementById("loadMore");
  var moreWrap = document.getElementById("moreWrap");
  var cartCount = document.getElementById("cartCount");

  function imgUrl(id, w) {
    return IMG_BASE + id + "?auto=format&fit=crop&w=" + (w || 700) + "&q=80";
  }

  /* ============ Custom dropdown ============ */
  var openDropdowns = [];

  function closeAllDropdowns() {
    openDropdowns.forEach(function (dd) {
      dd.classList.remove("is-open");
    });
    openDropdowns = [];
  }

  function createDropdown(opts, current, onSelect) {
    var dd = document.createElement("div");
    dd.className = "dd";
    dd.innerHTML =
      '<button class="dd__trigger" type="button"><span class="dd__value"></span>' + CHEVRON_SVG + "</button>" +
      '<div class="dd__menu"></div>';

    var trigger = dd.querySelector(".dd__trigger");
    var valueEl = dd.querySelector(".dd__value");
    var menu = dd.querySelector(".dd__menu");

    function setValue(v) {
      current = v;
      for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === v) {
          valueEl.textContent = opts[i].label;
          break;
        }
      }
    }

    setValue(current);

    opts.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dd__option" + (o.value === current ? " is-active" : "");
      b.textContent = o.label;
      b.addEventListener("click", function () {
        setValue(o.value);
        menu.querySelectorAll(".dd__option").forEach(function (x) {
          x.classList.toggle("is-active", x === b);
        });
        dd.classList.remove("is-open");
        openDropdowns = [];
        onSelect(o.value);
      });
      menu.appendChild(b);
    });

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var wasOpen = dd.classList.contains("is-open");
      closeAllDropdowns();
      if (!wasOpen) {
        dd.classList.add("is-open");
        openDropdowns.push(dd);
      }
    });

    return dd;
  }

  document.addEventListener("click", function () {
    closeAllDropdowns();
  });

  /* ============ Categories ============ */
  function renderCategories() {
    var row = document.getElementById("categories");
    row.innerHTML = CATEGORIES.map(function (c) {
      return (
        '<button class="cat' + (c.id === state.category ? " is-active" : "") + '" data-cat="' + c.id + '">' +
        c.icon +
        '<span class="cat__name">' + c.name + "</span></button>"
      );
    }).join("");

    row.querySelectorAll(".cat").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.category = btn.getAttribute("data-cat");
        state.visible = PER_PAGE;
        renderCategories();
        applyFilters();
      });
    });
  }

  function renderSkeleton() {
    var html = "";
    for (var i = 0; i < PER_PAGE; i++) {
      html +=
        '<div class="skeleton"><div class="skeleton__photo"></div><div class="skeleton__body">' +
        '<div class="skeleton__line"></div><div class="skeleton__line skeleton__line--short"></div></div></div>';
    }
    catalog.innerHTML = html;
  }

  /* ============ Filters ============ */
  function priceMatches(dish) {
    if (state.price === "all") return true;
    var parts = state.price.split("-");
    var min = parts[0] ? parseInt(parts[0], 10) : 0;
    var max = parts[1] ? parseInt(parts[1], 10) : Infinity;
    return dish.price >= min && dish.price < max;
  }

  function featuresMatch(dish) {
    if (state.features.length === 0) return true;
    return state.features.some(function (f) {
      return dish.features.indexOf(f) !== -1;
    });
  }

  function getFiltered() {
    var list = DISHES.filter(function (d) {
      return (state.category === "all" || d.cat === state.category) &&
        priceMatches(d) &&
        featuresMatch(d);
    });

    if (state.sort === "priceAsc") list.sort(function (a, b) { return a.price - b.price; });
    else if (state.sort === "priceDesc") list.sort(function (a, b) { return b.price - a.price; });
    else if (state.sort === "new") list.sort(function (a, b) { return (b.features.indexOf("new") !== -1) - (a.features.indexOf("new") !== -1); });
    else list.sort(function (a, b) { return (b.features.indexOf("popular") !== -1) - (a.features.indexOf("popular") !== -1); });

    return list;
  }

  /* ============ Dish card ============ */
  function dishCard(d, index) {
    var badge = d.badge ? '<span class="dish__badge">' + d.badge + "</span>" : "";
    var old = d.oldPrice ? '<span class="dish__old">' + d.oldPrice.toLocaleString("ru-RU") + " ₽</span>" : "";
    var fav = STORE.isFavorite(d.id) ? " is-active" : "";
    var link = "dish.html?id=" + d.id;

    return (
      '<article class="dish" data-id="' + d.id + '" style="animation-delay:' + (index % PER_PAGE) * 100 + 'ms">' +
      '<div class="dish__photo">' +
      '<img src="' + imgUrl(d.img) + '" alt="' + d.name + '" loading="lazy" />' +
      '<span class="dish__shade"></span>' + badge +
      '<a class="dish__link" href="' + link + '" aria-label="' + d.name + '"></a>' +
      '<button class="dish__add dish__add--quick" data-id="' + d.id + '" aria-label="Добавить в корзину">' + PLUS_SVG + "</button>" +
      '<span class="dish__view">Подробнее</span>' +
      "</div>" +
      '<div class="dish__body">' +
      '<div class="dish__head">' +
      '<a class="dish__name" href="' + link + '">' + d.name + "</a>" +
      '<button class="dish__fav' + fav + '" data-id="' + d.id + '" aria-label="В избранное">' + HEART_SVG + "</button>" +
      "</div>" +
      '<p class="dish__desc">' + d.desc + "</p>" +
      '<div class="dish__foot">' +
      '<div class="dish__prices"><span class="dish__price">' + d.price.toLocaleString("ru-RU") + " ₽</span>" + old + "</div>" +
      '<button class="dish__add" data-id="' + d.id + '" aria-label="Добавить в корзину">' + PLUS_SVG + "</button>" +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function applyFilters() {
    var list = getFiltered();

    var countText = list.length + " " + plural(list.length, "блюдо", "блюда", "блюд") + " найдено";
    resultsCount.textContent = countText;

    catalog.classList.add("is-switching");
    setTimeout(function () {
      var slice = list.slice(0, state.visible);
      catalog.innerHTML = slice.map(dishCard).join("");
      catalog.classList.remove("is-switching");

      if (list.length > state.visible) {
        moreWrap.classList.remove("is-hidden");
      } else {
        moreWrap.classList.add("is-hidden");
      }
    }, 250);
  }

  function plural(n, one, few, many) {
    var m10 = n % 10;
    var m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  /* ============ Add to cart / favorite ============ */
  function getDish(id) {
    for (var i = 0; i < DISHES.length; i++) {
      if (DISHES[i].id === id) return DISHES[i];
    }
    return null;
  }

  function addToCart(btn) {
    STORE.addToCart(parseInt(btn.getAttribute("data-id"), 10), 1);
    cartCount.textContent = STORE.cartCount();
    btn.classList.add("is-added");
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
    setTimeout(function () {
      btn.classList.remove("is-added");
      btn.innerHTML = PLUS_SVG;
    }, 2000);

    var cartBtn = document.getElementById("cartBtn");
    if (cartBtn) {
      cartBtn.classList.remove("bounce");
      void cartBtn.offsetWidth;
      cartBtn.classList.add("bounce");
    }
  }

  function bindCatalog() {
    catalog.addEventListener("click", function (e) {
      var add = e.target.closest(".dish__add");
      if (add) {
        addToCart(add);
        return;
      }

      var fav = e.target.closest(".dish__fav");
      if (fav) {
        var id = parseInt(fav.getAttribute("data-id"), 10);
        var nowFav = STORE.toggleFavorite(id);
        fav.classList.toggle("is-active", nowFav);
      }
    });
  }

  loadMore.addEventListener("click", function () {
    state.visible += PER_PAGE;
    applyFilters();
  });

  /* ============ Desktop filters ============ */
  function bindFilters() {
    var priceHost = document.getElementById("priceDd");
    var sortHost = document.getElementById("sortDd");

    priceHost.appendChild(createDropdown(PRICE_OPTIONS, state.price, function (v) {
      state.price = v;
      state.visible = PER_PAGE;
      applyFilters();
    }));

    sortHost.appendChild(createDropdown(SORT_OPTIONS, state.sort, function (v) {
      state.sort = v;
      state.visible = PER_PAGE;
      applyFilters();
    }));

    document.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-feature");
        var idx = state.features.indexOf(f);
        if (idx === -1) state.features.push(f);
        else state.features.splice(idx, 1);
        chip.classList.toggle("is-active");
        state.visible = PER_PAGE;
        applyFilters();
      });
    });
  }

  /* ============ Mobile sheet ============ */
  function buildMobileSheet() {
    var body = document.getElementById("sheetBody");
    body.innerHTML = "";

    var priceLabel = document.createElement("span");
    priceLabel.className = "field__label";
    priceLabel.textContent = "Цена";
    var priceHost = document.createElement("div");
    priceHost.appendChild(createDropdown(PRICE_OPTIONS, state.price, function (v) {
      state.price = v;
    }));

    var sortLabel = document.createElement("span");
    sortLabel.className = "field__label";
    sortLabel.textContent = "Сортировать";
    var sortHost = document.createElement("div");
    sortHost.appendChild(createDropdown(SORT_OPTIONS, state.sort, function (v) {
      state.sort = v;
    }));

    var chips = document.createElement("div");
    chips.className = "sheet__chips";
    chips.id = "mChips";
    chips.innerHTML = ["new:Новинка", "popular:Популярное", "veg:Вегетарианское", "chef:От шефа"].map(function (pair) {
      var parts = pair.split(":");
      var active = state.features.indexOf(parts[0]) !== -1 ? " is-active" : "";
      return '<button class="chip' + active + '" data-feature="' + parts[0] + '">' + parts[1] + "</button>";
    }).join("");

    body.appendChild(priceLabel);
    body.appendChild(priceHost);
    body.appendChild(sortLabel);
    body.appendChild(sortHost);
    body.appendChild(chips);

    chips.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        chip.classList.toggle("is-active");
      });
    });
  }

  function openSheet() {
    buildMobileSheet();
    document.getElementById("sheet").classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeSheet() {
    document.getElementById("sheet").classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function applySheet() {
    var activeChips = document.querySelectorAll("#mChips .chip.is-active");
    state.features = [];
    activeChips.forEach(function (chip) {
      state.features.push(chip.getAttribute("data-feature"));
    });
    document.querySelectorAll(".filters .chip").forEach(function (chip) {
      chip.classList.toggle("is-active", state.features.indexOf(chip.getAttribute("data-feature")) !== -1);
    });
    state.visible = PER_PAGE;
    applyFilters();
    closeSheet();
  }

  /* ============ Header / parallax ============ */
  function initHeader() {
    var header = document.getElementById("header");
    var burger = document.getElementById("burger");
    var nav = document.getElementById("nav");

    function onScroll() {
      if (window.scrollY > 40) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll(".nav__link").forEach(function (l) {
      l.addEventListener("click", function () {
        nav.classList.remove("is-open");
        burger.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  function initParallax() {
    var bg = document.querySelector(".menu-hero__bg");
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (bg && window.scrollY < 350) {
            bg.style.transform = "translateY(" + window.scrollY * 0.35 + "px)";
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============ Init ============ */
  document.getElementById("mobileFilters").addEventListener("click", openSheet);
  document.getElementById("sheetBackdrop").addEventListener("click", closeSheet);
  document.getElementById("sheetClose").addEventListener("click", closeSheet);
  document.getElementById("sheetApply").addEventListener("click", applySheet);

  initHeader();
  initParallax();
  renderCategories();
  bindFilters();
  bindCatalog();

  cartCount.textContent = STORE.cartCount();
  renderSkeleton();

  var rendered = false;
  function firstRender() {
    if (rendered) return;
    rendered = true;
    applyFilters();
  }

  if (document.body.classList.contains("is-loaded")) {
    firstRender();
  } else {
    document.addEventListener("aurelio:loaded", firstRender);
    setTimeout(firstRender, 2500);
  }
})();
