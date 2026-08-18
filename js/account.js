(function () {
  "use strict";

  var DATA = window.AURELIO_DATA;
  var STORE = window.AURELIO_STORE;
  var DISHES = DATA.DISHES;
  var IMG_BASE = DATA.IMG_BASE;

  var sideNav = document.getElementById("sideNav");
  var panels = document.querySelectorAll(".panel");

  function showPanel(name) {
    sideNav.querySelectorAll(".side-nav__link").forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-section") === name);
    });
    panels.forEach(function (panel) {
      panel.classList.toggle("is-active", panel.getAttribute("data-panel") === name);
    });
    document.getElementById("mobileMenu").classList.remove("is-open");
  }

  sideNav.addEventListener("click", function (e) {
    var link = e.target.closest(".side-nav__link");
    if (link) showPanel(link.getAttribute("data-section"));
  });

  document.querySelectorAll("[data-goto]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showPanel(btn.getAttribute("data-goto"));
    });
  });

  var mobileMenu = document.getElementById("mobileMenu");
  var mobileToggle = document.getElementById("mobileToggle");

  function buildMobileMenu() {
    mobileMenu.innerHTML = "";
    sideNav.querySelectorAll(".side-nav__link").forEach(function (link) {
      var clone = link.cloneNode(true);
      clone.addEventListener("click", function () {
        showPanel(clone.getAttribute("data-section"));
      });
      mobileMenu.appendChild(clone);
    });
  }
  buildMobileMenu();

  mobileToggle.addEventListener("click", function () {
    mobileMenu.classList.toggle("is-open");
  });

  document.querySelectorAll(".toggle").forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var active = toggle.classList.toggle("is-active");
      toggle.setAttribute("aria-checked", active ? "true" : "false");
    });
  });

  /* ============ Favorites (from store) ============ */
  var HEART_FILLED =
    '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M12 21C7 17 4 13.5 4 9.5A5.5 5.5 0 0 1 12 7a5.5 5.5 0 0 1 8 2.5C20 13.5 17 17 12 21z"/></svg>';

  function getDish(id) {
    for (var i = 0; i < DISHES.length; i++) {
      if (DISHES[i].id === id) return DISHES[i];
    }
    return null;
  }

  function favCard(d) {
    return (
      '<div class="fav">' +
      '<div class="fav__photo">' +
      '<a class="fav__link" href="dish.html?id=' + d.id + '">' +
      '<img src="' + IMG_BASE + d.img + '?auto=format&fit=crop&w=400&q=80" alt="' + d.name + '" loading="lazy" />' +
      "</a>" +
      '<button class="fav__heart is-active" data-id="' + d.id + '" aria-label="Убрать из избранного">' + HEART_FILLED + "</button>" +
      "</div>" +
      '<div class="fav__body">' +
      '<span class="fav__name">' + d.name + "</span>" +
      '<span class="fav__price">' + d.price.toLocaleString("ru-RU") + " ₽</span>" +
      "</div>" +
      "</div>"
    );
  }

  function emptyState() {
    return '<p class="favs-empty">Пока нет избранных блюд. Добавьте их в <a href="menu.html" style="color:#d0a45a;">меню</a>.</p>';
  }

  function renderFavorites() {
    var ids = STORE.getFavorites();
    var list = ids.map(getDish).filter(Boolean);

    var preview = document.querySelector(".favs:not(.favs--grid)");
    if (preview) {
      preview.innerHTML = list.length
        ? list.slice(0, 4).map(favCard).join("")
        : emptyState();
    }

    var full = document.querySelector(".favs--grid");
    if (full) {
      full.innerHTML = list.length ? list.map(favCard).join("") : emptyState();
    }
  }

  document.addEventListener("click", function (e) {
    var heart = e.target.closest(".fav__heart");
    if (!heart) return;
    var id = parseInt(heart.getAttribute("data-id"), 10);
    STORE.toggleFavorite(id);
    renderFavorites();
  });

  renderFavorites();

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
    var els = document.querySelectorAll(".profile-card, .stats, .block, .sidebar");
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
