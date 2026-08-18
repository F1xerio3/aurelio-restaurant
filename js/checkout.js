(function () {
  "use strict";

  var DATA = window.AURELIO_DATA;
  var STORE = window.AURELIO_STORE;
  var DISHES = DATA.DISHES;
  var IMG_BASE = DATA.IMG_BASE;

  var DELIVERY_FEE = 300;
  var PROMO_CODE = "AURELIO10";
  var PROMO_RATE = 0.1;

  var promoApplied = false;

  var orderItems = document.getElementById("orderItems");
  var orderCount = document.getElementById("orderCount");
  var cartCount = document.getElementById("cartCount");
  var subtotalEl = document.getElementById("subtotal");
  var discountRow = document.getElementById("discountRow");
  var discountEl = document.getElementById("discount");
  var deliveryEl = document.getElementById("delivery");
  var totalEl = document.getElementById("total");

  function fmt(n) {
    return n.toLocaleString("ru-RU") + " ₽";
  }

  function imgUrl(id) {
    return IMG_BASE + id + "?auto=format&fit=crop&w=200&q=80";
  }

  function getDish(id) {
    for (var i = 0; i < DISHES.length; i++) {
      if (DISHES[i].id === id) return DISHES[i];
    }
    return null;
  }

  function plural(n, one, few, many) {
    var m10 = n % 10;
    var m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  function renderItems() {
    var cart = STORE.getCart();
    var html = cart.map(function (item) {
      var d = getDish(item.id);
      if (!d) return "";
      return (
        '<div class="order-item" data-id="' + item.id + '">' +
        '<img class="order-item__img" src="' + imgUrl(d.img) + '" alt="' + d.name + '" />' +
        '<div class="order-item__info">' +
        '<span class="order-item__name">' + d.name + "</span>" +
        '<span class="order-item__desc">' + d.desc + "</span>" +
        "</div>" +
        '<div class="order-item__right">' +
        '<span class="order-item__price">' + fmt(d.price * item.qty) + "</span>" +
        '<div class="qty">' +
        '<button class="qty__btn" data-action="dec" data-id="' + item.id + '" aria-label="Уменьшить">&minus;</button>' +
        '<span class="qty__val">' + item.qty + "</span>" +
        '<button class="qty__btn" data-action="inc" data-id="' + item.id + '" aria-label="Увеличить">+</button>' +
        "</div>" +
        "</div>" +
        "</div>"
      );
    }).join("");

    if (!html) {
      html = '<p class="order-empty">Корзина пуста. Перейдите в <a href="menu.html" style="color:#d0a45a;">меню</a>.</p>';
    }
    orderItems.innerHTML = html;
  }

  function recalc() {
    var cart = STORE.getCart();
    var subtotal = 0;
    var totalQty = 0;
    cart.forEach(function (item) {
      var d = getDish(item.id);
      if (d) {
        subtotal += d.price * item.qty;
        totalQty += item.qty;
      }
    });

    var discount = promoApplied ? Math.round(subtotal * PROMO_RATE) : 0;
    var total = subtotal - discount + DELIVERY_FEE;

    subtotalEl.textContent = fmt(subtotal);
    deliveryEl.textContent = fmt(DELIVERY_FEE);
    totalEl.textContent = fmt(total);
    orderCount.textContent = totalQty + " " + plural(totalQty, "блюдо", "блюда", "блюд");
    cartCount.textContent = totalQty;

    if (promoApplied) {
      discountRow.hidden = false;
      discountEl.textContent = "−" + fmt(discount);
    } else {
      discountRow.hidden = true;
    }
  }

  function bump(val) {
    val.classList.remove("bump");
    void val.offsetWidth;
    val.classList.add("bump");
  }

  orderItems.addEventListener("click", function (e) {
    var btn = e.target.closest(".qty__btn");
    if (!btn) return;

    var id = parseInt(btn.getAttribute("data-id"), 10);
    var action = btn.getAttribute("data-action");
    var cart = STORE.getCart();
    var item = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        item = cart[i];
        break;
      }
    }
    if (!item) return;

    if (action === "inc") STORE.setQty(id, item.qty + 1);
    else if (action === "dec" && item.qty > 1) STORE.setQty(id, item.qty - 1);

    renderItems();
    recalc();
    var itemEl = orderItems.querySelector('[data-id="' + id + '"] .qty__val');
    if (itemEl) bump(itemEl);
  });

  var promoInput = document.getElementById("promoInput");
  var promoBtn = document.getElementById("promoBtn");

  promoBtn.addEventListener("click", function () {
    var code = promoInput.value.trim().toUpperCase();
    if (code === PROMO_CODE && !promoApplied) {
      promoApplied = true;
      promoBtn.classList.add("is-applied");
      promoBtn.textContent = "Применён";
      promoInput.value = "";
      recalc();
    } else if (promoApplied) {
      promoApplied = false;
      promoBtn.classList.remove("is-applied");
      promoBtn.textContent = "Применить";
      recalc();
    } else {
      promoInput.value = "";
      promoInput.placeholder = "Неверный промокод";
    }
  });

  var deliveryInputs = document.querySelectorAll('input[name="delivery"]');
  var timeField = document.getElementById("timeField");

  deliveryInputs.forEach(function (radio) {
    radio.addEventListener("change", function () {
      document.querySelectorAll(".option").forEach(function (o) {
        o.classList.remove("is-active");
      });
      radio.closest(".option").classList.add("is-active");
      timeField.hidden = radio.value !== "time";
    });
  });

  var submitBtn = document.getElementById("submitBtn");
  submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    var original = submitBtn.textContent;
    submitBtn.textContent = "Заказ оформлен";
    submitBtn.style.pointerEvents = "none";
    setTimeout(function () {
      submitBtn.textContent = original;
      submitBtn.style.pointerEvents = "";
    }, 2500);
  });

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
    var els = document.querySelectorAll(".form-card");
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
  renderItems();
  recalc();
})();
