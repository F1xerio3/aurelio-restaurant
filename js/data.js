(function () {
  "use strict";

  window.AURELIO_DATA = {
    IMG_BASE: "https://images.unsplash.com/",
    CATEGORY_NAMES: {
      all: "Все блюда",
      starters: "Закуски",
      salads: "Салаты",
      soups: "Супы",
      mains: "Основные блюда",
      desserts: "Десерты",
      drinks: "Напитки",
      wine: "Вино"
    },
    DISHES: [
      { id: 1, name: "Карпаччо из говядины", desc: "Тонкие слайсы, руккола, пармезан, трюфельное масло", price: 1200, cat: "starters", badge: "Новинка", features: ["new", "chef"], ingredients: "Говядина, руккола, пармезан, трюфельное масло, лимон", img: "photo-1544025162-d76694265947" },
      { id: 2, name: "Брускетта с томатами", desc: "Гриль-хлеб, конкассе, базилик, бальзамик", price: 690, cat: "starters", badge: null, features: ["veg"], ingredients: "Чиабатта, томаты, базилик, оливковое масло, бальзамик", img: "photo-1572695157366-5e585ab2b69f" },
      { id: 3, name: "Тартар из тунца", desc: "Свежий тунец, авокадо, соус понзу, кунжут", price: 1450, cat: "starters", badge: "Выбор шефа", features: ["chef"], ingredients: "Тунец, авокадо, соус понзу, кунжут, лук-шалот", img: "photo-1579584425555-c3ce17fd4351" },
      { id: 4, name: "Салат с грейпфрутом", desc: "Зелень, грейпфрут, козий сыр, орехи", price: 1400, cat: "salads", badge: null, features: ["veg"], ingredients: "Зелень, грейпфрут, козий сыр, грецкий орех, мёд", img: "photo-1546069901-ba9599a7e63c" },
      { id: 5, name: "Цезарь с курицей", desc: "Романо, курица су-вид, пармезан, гренки", price: 890, cat: "salads", badge: null, features: [], ingredients: "Романо, куриное филе, пармезан, гренки, соус цезарь", img: "photo-1550304943-4f24f54ddde9" },
      { id: 6, name: "Капрезе", desc: "Моцарелла буффало, томаты, базилик, оливковое масло", price: 790, cat: "salads", badge: null, features: ["veg"], ingredients: "Моцарелла буффало, томаты, базилик, оливковое масло", img: "photo-1512621776951-a57141f2eefd" },
      { id: 7, name: "Крем-суп из трюфеля", desc: "Белый трюфель, сливки, трюфельная крошка", price: 950, cat: "soups", badge: "Выбор шефа", features: ["chef"], ingredients: "Белый трюфель, сливки, картофель, трюфельная крошка", img: "photo-1547592180-85f173990554" },
      { id: 8, name: "Томатный суп", desc: "Печёные томаты, базилик, сливочное масло", price: 690, cat: "soups", badge: null, features: ["veg"], ingredients: "Печёные томаты, базилик, сливочное масло, чеснок", img: "photo-1547592166-23ac45744acd" },
      { id: 9, name: "Бульон с равиоли", desc: "Прозрачный бульон, равиоли с мясом, зелень", price: 850, cat: "soups", badge: null, features: [], ingredients: "Говяжий бульон, равиоли с мясом, зелень", img: "photo-1476718406336-bb5a9690ee2a" },
      { id: 10, name: "Стейк Рибай", desc: "Мраморная говядина, овощи гриль, соус демиглас", price: 3450, cat: "mains", badge: "Выбор шефа", features: ["chef", "popular"], ingredients: "Говядина Black Angus, розмарин, овощи гриль, соус демиглас", oldPrice: 4000, img: "photo-1600891964092-4316c288032e" },
      { id: 11, name: "Тальятелле с трюфелем", desc: "Домашняя паста, чёрный трюфель, сливочный соус", price: 2400, cat: "mains", badge: "Популярное", features: ["popular"], ingredients: "Домашняя паста, чёрный трюфель, сливочный соус, пармезан", img: "photo-1473093295043-cdd812d0e601" },
      { id: 12, name: "Лосось на гриле", desc: "Филе лосося, спаржа, лимонный соус", price: 2100, cat: "mains", badge: null, features: [], ingredients: "Лосось, спаржа, лимонный соус, оливковое масло", img: "photo-1467003909585-2f8a72700288" },
      { id: 13, name: "Ризотто с грибами", desc: "Карнароли, белые грибы, пармезан, трюфель", price: 1850, cat: "mains", badge: null, features: ["veg"], ingredients: "Рис карнароли, белые грибы, пармезан, трюфельное масло", img: "photo-1476124369491-e7addf5db371" },
      { id: 14, name: "Утиная грудка", desc: "Магре, вишнёвый соус, пюре из сельдерея", price: 2300, cat: "mains", badge: "Новинка", features: ["new"], ingredients: "Утиная грудка, вишнёвый соус, пюре из сельдерея", oldPrice: 2600, img: "photo-1546833999-b9f581a1996d" },
      { id: 15, name: "Шоколадный фондан", desc: "Тёмный шоколад, ванильное мороженое, малина", price: 950, cat: "desserts", badge: "Популярное", features: ["popular"], ingredients: "Тёмный шоколад, ванильное мороженое, малина", img: "photo-1551024506-0bccd828d307" },
      { id: 16, name: "Тирамису", desc: "Классический итальянский десерт, маскарпоне", price: 780, cat: "desserts", badge: null, features: [], ingredients: "Маскарпоне, савоярди, эспрессо, какао", img: "photo-1571877227200-a0d98ea607e9" },
      { id: 17, name: "Панна-котта", desc: "Ванильный крем, ягодный кули, мята", price: 650, cat: "desserts", badge: null, features: ["veg"], ingredients: "Сливки, ваниль, ягодный кули, мята", img: "photo-1488477181946-6428a0291777" },
      { id: 18, name: "Эспрессо", desc: "Свежеобжаренная арабика, плотная крема", price: 350, cat: "drinks", badge: null, features: [], ingredients: "Арабика свежей обжарки, вода", img: "photo-1510707577719-ae7c14805e3a" },
      { id: 19, name: "Лимонад домашний", desc: "Цитрус, мята, газированная вода", price: 450, cat: "drinks", badge: null, features: ["veg"], ingredients: "Цитрус, мята, газированная вода, тростниковый сахар", img: "photo-1523677011781-c91d1bbe2f9d" },
      { id: 20, name: "Смузи манго", desc: "Манго, апельсин, лёд, свежая мята", price: 520, cat: "drinks", badge: null, features: ["veg"], ingredients: "Манго, апельсин, лёд, свежая мята", img: "photo-1502741224143-90386d7f8c82" },
      { id: 21, name: "Barolo DOCG", desc: "Красное вино, Пьемонт, выдержка 36 месяцев", price: 4200, cat: "wine", badge: "Выбор шефа", features: ["chef", "popular"], ingredients: "Виноград Неббиоло, регион Пьемонт", img: "photo-1510812431401-41d2bd2722f3" },
      { id: 22, name: "Chianti Classico", desc: "Красное вино, Тоскана, санджовезе", price: 2800, cat: "wine", badge: null, features: [], ingredients: "Виноград Санджовезе, регион Тоскана", img: "photo-1506377247377-2a5b3b417ebb" },
      { id: 23, name: "Prosecco", desc: "Игристое белое, Венето, глера", price: 1900, cat: "wine", badge: null, features: [], ingredients: "Виноград Глера, регион Венето", img: "photo-1553361371-9b22f78e8b1d" },
      { id: 24, name: "Шампанское Brut", desc: "Игристое, Шампань, шардоне", price: 3600, cat: "wine", badge: "Новинка", features: ["new"], ingredients: "Шардоне, регион Шампань", img: "photo-1544145945-f90425340c7e" }
    ]
  };
})();
