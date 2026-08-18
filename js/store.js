(function () {
  "use strict";

  var CART_KEY = "aurelio_cart";
  var FAV_KEY = "aurelio_favs";

  var DEFAULT_CART = [
    { id: 10, qty: 1 },
    { id: 4, qty: 1 },
    { id: 15, qty: 1 }
  ];

  var DEFAULT_FAVS = [10, 11, 15, 21, 12, 4];

  function read(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return Array.isArray(v) ? v : null;
    } catch (e) {
      return null;
    }
  }

  function write(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  if (read(CART_KEY) === null) {
    write(CART_KEY, DEFAULT_CART);
  }

  if (read(FAV_KEY) === null) {
    write(FAV_KEY, DEFAULT_FAVS);
  }

  var store = {
    getCart: function () {
      return read(CART_KEY) || [];
    },

    addToCart: function (id, qty) {
      qty = qty || 1;
      var cart = this.getCart();
      var item = null;
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
          item = cart[i];
          break;
        }
      }
      if (item) {
        item.qty += qty;
      } else {
        cart.push({ id: id, qty: qty });
      }
      write(CART_KEY, cart);
      return cart;
    },

    setQty: function (id, qty) {
      var cart = this.getCart();
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
          if (qty <= 0) {
            cart.splice(i, 1);
          } else {
            cart[i].qty = qty;
          }
          break;
        }
      }
      write(CART_KEY, cart);
      return cart;
    },

    cartCount: function () {
      return this.getCart().reduce(function (sum, item) {
        return sum + item.qty;
      }, 0);
    },

    getFavorites: function () {
      return read(FAV_KEY) || [];
    },

    isFavorite: function (id) {
      return this.getFavorites().indexOf(id) !== -1;
    },

    toggleFavorite: function (id) {
      var favs = this.getFavorites();
      var idx = favs.indexOf(id);
      if (idx === -1) {
        favs.push(id);
        write(FAV_KEY, favs);
        return true;
      } else {
        favs.splice(idx, 1);
        write(FAV_KEY, favs);
        return false;
      }
    }
  };

  window.AURELIO_STORE = store;
})();
