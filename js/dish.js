(function () {
  "use strict";

  var DATA = window.AURELIO_DATA;
  var DISHES = DATA.DISHES;
  var CATEGORY_NAMES = DATA.CATEGORY_NAMES;
  var IMG_BASE = DATA.IMG_BASE;

  function imgUrl(id, w) {
    return IMG_BASE + id + "?auto=format&fit=crop&w=" + (w || 900) + "&q=80";
  }

  function getParam(name) {
    var m = window.location.search.match(new RegExp("[?&]" + name + "=([^&]+)"));
    return m ? decodeURIComponent(m[1]) : null;
  }

  function getDish(id) {
    for (var i = 0; i < DISHES.length; i++) {
      if (DISHES[i].id === id) return DISHES[i];
    }
    return null;
  }

  var id = parseInt(getParam("id"), 10);
  var dish = getDish(id) || DISHES[0];

  document.title = dish.name + " — AURELIO";

  var img = document.getElementById("dishImg");
  var badge = document.getElementById("dishBadge");
  var cat = document.getElementById("dishCat");
  var name = document.getElementById("dishName");
  var desc = document.getElementById("dishDesc");
  var ingr = document.getElementById("dishIngr");
  var price = document.getElementById("dishPrice");
  var old = document.getElementById("dishOld");

  img.src = imgUrl(dish.img, 1000);
  img.alt = dish.name;
  badge.textContent = dish.badge || "";
  badge.style.display = dish.badge ? "" : "none";
  cat.textContent = CATEGORY_NAMES[dish.cat] || "";
  var breadcrumbCat = document.getElementById("breadcrumbCat");
  breadcrumbCat.textContent = CATEGORY_NAMES[dish.cat] || "Блюдо";
  name.textContent = dish.name;
  desc.textContent = dish.desc;
  ingr.textContent = dish.ingredients || dish.desc;
  price.textContent = dish.price.toLocaleString("ru-RU") + " ₽";
  old.textContent = dish.oldPrice ? dish.oldPrice.toLocaleString("ru-RU") + " ₽" : "";
  old.style.display = dish.oldPrice ? "" : "none";

  /* Qty */
  var qty = 1;
  var qtyVal = document.getElementById("qtyVal");
  document.getElementById("qtyInc").addEventListener("click", function () {
    qty++;
    qtyVal.textContent = qty;
  });
  document.getElementById("qtyDec").addEventListener("click", function () {
    if (qty > 1) qty--;
    qtyVal.textContent = qty;
  });

  /* Add to cart */
  var STORE = window.AURELIO_STORE;

  var addBtn = document.getElementById("addBtn");
  addBtn.addEventListener("click", function () {
    STORE.addToCart(dish.id, qty);
    var original = addBtn.textContent;
    addBtn.textContent = "Добавлено";
    addBtn.style.pointerEvents = "none";
    setTimeout(function () {
      addBtn.textContent = original;
      addBtn.style.pointerEvents = "";
    }, 1500);
  });

  /* Favorite */
  var favBtn = document.getElementById("favBtn");
  function setFavLabel() {
    if (STORE.isFavorite(dish.id)) {
      favBtn.classList.add("is-active");
      favBtn.querySelector("span").textContent = "В избранном";
    } else {
      favBtn.classList.remove("is-active");
      favBtn.querySelector("span").textContent = "В избранное";
    }
  }
  favBtn.addEventListener("click", function () {
    STORE.toggleFavorite(dish.id);
    setFavLabel();
  });
  setFavLabel();

  /* Related */
  var relatedHost = document.getElementById("related");
  var related = DISHES.filter(function (d) {
    return d.cat === dish.cat && d.id !== dish.id;
  }).slice(0, 3);

  if (related.length === 0) {
    related = DISHES.filter(function (d) { return d.id !== dish.id; }).slice(0, 3);
  }

  relatedHost.innerHTML = related.map(function (d) {
    return (
      '<a class="mini" href="dish.html?id=' + d.id + '">' +
      '<div class="mini__photo"><img src="' + imgUrl(d.img, 400) + '" alt="' + d.name + '" loading="lazy" /></div>' +
      '<div class="mini__body"><span class="mini__name">' + d.name + '</span><span class="mini__price">' + d.price.toLocaleString("ru-RU") + " ₽</span></div>" +
      "</a>"
    );
  }).join("");

  /* Header */
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

  function initReveal() {
    var els = document.querySelectorAll(".product, .related");
    if (!("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    els.forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  initHeader();
  initReveal();
})();
