(function () {
  "use strict";

  var loader = document.getElementById("loader");
  var hidden = false;

  function markLoaded() {
    document.body.classList.add("is-loaded");
    if (window.CustomEvent) {
      document.dispatchEvent(new CustomEvent("aurelio:loaded"));
    }
  }

  function hideLoader() {
    if (hidden) return;
    hidden = true;
    if (loader) {
      loader.classList.add("is-hidden");
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 800);
    }
    markLoaded();
  }

  if (loader) {
    if (document.readyState === "complete") {
      setTimeout(hideLoader, 1600);
    } else {
      window.addEventListener("load", function () {
        setTimeout(hideLoader, 1600);
      });
    }
    setTimeout(hideLoader, 3000);
  } else {
    markLoaded();
  }

  function initBlurLoad() {
    var imgs = document.querySelectorAll("img");
    imgs.forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) return;
      img.classList.add("blur-load");
      img.addEventListener("load", function () {
        img.classList.remove("blur-load");
      });
      img.addEventListener("error", function () {
        img.classList.remove("blur-load");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBlurLoad);
  } else {
    initBlurLoad();
  }
})();
