(function () {
  "use strict";

  var header = document.getElementById("header");
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  var navLinks = nav.querySelectorAll(".nav__link");

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  function onToggleMenu() {
    var open = nav.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  function onCloseMenu() {
    nav.classList.remove("is-open");
    burger.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  burger.addEventListener("click", onToggleMenu);
  navLinks.forEach(function (link) {
    link.addEventListener("click", onCloseMenu);
  });
  onScroll();

  var heroBg = document.querySelector(".hero__bg");
  var ticking = false;
  function onParallax() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (heroBg && window.scrollY < window.innerHeight) {
          heroBg.style.transform = "translateY(" + window.scrollY * 0.35 + "px)";
        }
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onParallax, { passive: true });

  var revealEls = document.querySelectorAll(".section, .gallery__item");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  var phoneInput = document.getElementById("bookingPhone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      var digits = phoneInput.value.replace(/\D/g, "");
      if (digits.charAt(0) === "7" || digits.charAt(0) === "8") {
        digits = digits.slice(1);
      }
      digits = digits.slice(0, 10);
      var res = "+7";
      if (digits.length > 0) res += " (" + digits.slice(0, 3);
      if (digits.length >= 3) res += ")";
      if (digits.length > 3) res += " " + digits.slice(3, 6);
      if (digits.length > 6) res += "-" + digits.slice(6, 8);
      if (digits.length > 8) res += "-" + digits.slice(8, 10);
      phoneInput.value = res;
    });
  }

  var form = document.getElementById("bookingForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector(".booking__submit");
      var original = btn.textContent;
      btn.textContent = "Бронь отправлена";
      btn.disabled = true;
      form.reset();
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
      }, 2500);
    });
  }
})();
