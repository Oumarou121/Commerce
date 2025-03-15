var filteredProducts = [];
var compareProducts = [];

class User {
  constructor(id, email, addresses = [], currentIndex) {
    this.id = id;
    this.email = email;
    this.addresses = addresses;
    this.currentIndex = currentIndex;
  }

  addAdress(address) {
    this.addresses.push(address);
  }
}

class Address {
  constructor(
    firstName,
    lastName,
    phoneNumber1,
    phoneNumber2,
    region,
    district,
    street
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber1 = phoneNumber1;
    this.phoneNumber2 = phoneNumber2;
    this.region = region;
    this.district = district;
    this.street = street;
  }
}

class orderItemHistory {
  constructor(status, updateAt, endingAt = null) {
    this.status = status;
    this.updateAt = updateAt;
    this.endingAt = endingAt;
  }
}

class orderItem {
  constructor(
    productId,
    productName,
    image,
    price,
    priceReduction,
    quantity,
    history = []
  ) {
    this.productId = productId;
    this.productName = productName;
    this.image = image;
    this.price = price;
    this.priceReduction = priceReduction;
    this.quantity = quantity;
    this.history = history;
  }
}

class Order {
  constructor(
    id,
    userId,
    items = [],
    shippingAddress = null,
    payment,
    totalPrice,
    deliveryPrice,
    status,
    createAt,
    updateAt
  ) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.shippingAddress = shippingAddress;
    this.payment = payment;
    this.totalPrice = totalPrice;
    this.deliveryPrice = deliveryPrice;
    this.status = status;
    this.createAt = createAt;
    this.updateAt = updateAt;
  }

  getItems() {
    return this.items;
  }
}

class ordersManager {
  constructor(orders = []) {
    this.orders = orders;
  }

  addOrder(order) {
    this.orders.push(order);
  }

  getOrderById(id) {
    return this.orders.filter((o) => o.id === id);
  }

  getOrders() {
    return this.orders;
  }
}

var user = new User(
  0,
  "oumaroumamodou123@gmail.com",
  [
    // new Address("Oumarou", "Mamoudou", "", "", "", "", ""),

    new Address(
      "Oumarou",
      "M1",
      "+227 98663248",
      "+227 94464839",
      "Niamey",
      "Dar es salam",
      "Pharmacy Say"
    ),
    new Address(
      "Oumarou",
      "M2",
      "+227 98663248",
      "+227 94464839",
      "Niamey",
      "Dar es salam",
      "Pharmacy Say"
    ),
    new Address(
      "Oumarou",
      "M3",
      "+227 98663248",
      "+227 94464839",
      "Niamey",
      "Dar es salam",
      "Pharmacy Say"
    ),
  ],
  0
);

class Product {
  constructor(
    id,
    sales,
    qty,
    name,
    category,
    price,
    priceReduction,
    images,
    specs,
    reviews
  ) {
    this.id = id;
    this.sales = sales;
    this.qty = qty;
    this.name = name;
    this.category = category;
    this.price = price;
    this.priceReduction = priceReduction;
    this.images = images;
    this.specs = specs;
    this.reviews = reviews;
    this.reference = this.generateReference();
    this.description = this.generateDescription();
  }

  generateReference() {
    const model = this.name.split(" ")[0].toUpperCase();
    const ram = this.specs["Mémoire RAM"]
      ? this.specs["Mémoire RAM"].match(/\d+/)[0]
      : "NA";
    const storage = this.specs["Stockage"]
      ? this.specs["Stockage"].match(/\d+/)[0]
      : "NA";
    const color = this.specs["Couleur"]
      ? this.specs["Couleur"].substring(0, 2).toUpperCase()
      : "XX";

    return `${model}-${ram}-${storage}-${color}`;
  }

  generateDescription() {
    let desc = `[${this.reference}]\n`;

    for (const [key, value] of Object.entries(this.specs)) {
      desc += `- ${key} : ${value}\n`;
    }

    return desc.trim();
  }
}

class ProductManager {
  constructor(products) {
    this.products = products;
  }

  findMostSimilarProducts(product, limit = 8) {
    const sameCategoryProducts = this.products.filter(
      (p) => p.category === product.category && p.id !== product.id
    );

    const sortedBySimilarity = sameCategoryProducts
      .map((p) => {
        const commonSpecsCount = this.countCommonSpecs(p, product);
        return { product: p, commonSpecsCount };
      })
      .sort((a, b) => b.commonSpecsCount - a.commonSpecsCount)
      .slice(0, limit);

    return sortedBySimilarity.map((item) => item.product);
  }

  countCommonSpecs(p1, p2) {
    let commonSpecsCount = 0;
    for (const [key, value] of Object.entries(p1.specs)) {
      if (p2.specs[key] === value) {
        commonSpecsCount++;
      }
    }
    return commonSpecsCount;
  }
}

class CartItem {
  constructor(productId, quantity = 1) {
    this.productId = productId;
    this.quantity = quantity;
  }
}

class Cart {
  constructor(items = []) {
    this.items = items;
  }

  addItem(cartItem) {
    const existingItem = this.items.find(
      (item) => item.productId === cartItem.productId
    );
    if (existingItem) {
      existingItem.quantity += cartItem.quantity;
    } else {
      this.items.push(cartItem);
    }
  }

  removeItem(productId) {
    const index = this.items.findIndex((item) => item.productId === productId);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }

  updateQuantity(productId, quantity) {
    const index = this.items.findIndex((item) => item.productId === productId);
    if (index >= 0) {
      this.items[index].quantity = this.items[index].quantity + quantity;
    }
  }

  getTotal() {
    const subtotal = this.items.reduce((total, item) => {
      const product = products[item.productId];
      return product ? total + item.quantity * product.price : total;
    }, 0);

    const shippingCost = 1000;

    return subtotal + shippingCost;
  }

  getItems() {
    return this.items.map((item) => ({
      product: products[item.productId],
      quantity: item.quantity,
    }));
  }

  clear() {
    this.items = [];
  }
}

class Blog {
  constructor(id, name, paragraphs, important, date, comments, tag, reviews) {
    this.id = id;
    this.name = name;
    this.paragraphs = paragraphs;
    this.important = important;
    this.date = date;
    this.comments = comments;
    this.tag = tag;
    this.reviews = reviews;
  }
}

function getUniqueTags(blogs) {
  return [...new Set(blogs.map((blog) => blog.tag.trim().toLowerCase()))];
}

function formatDate(timestamp) {
  const date = new Date(timestamp);

  const optionsDate = { day: "numeric", month: "long", year: "numeric" };
  const optionsTime = { hour: "2-digit", minute: "2-digit" };

  const formattedDate = date.toLocaleDateString("fr-FR", optionsDate);
  const formattedTime = date.toLocaleTimeString("fr-FR", optionsTime);

  return `${formattedDate} à ${formattedTime}`;
}

function formatDateOrder(date1, date2 = null) {
  if (date2 === null) {
    return `Le ${formatDate(date1)}`;
  } else {
    return `Entre Le ${formatDate(date1)} et le ${formatDate(date2)}`;
  }
}

const products = [
  new Product(
    0,
    100,
    10,
    "Uphone lightning cable",
    "Téléphonie & Tablette/Accessoirs/Chargeurs & cablés",
    10000,
    0,
    [
      "//drou-electronics-store.myshopify.com/cdn/shop/products/p4_c46c6d30-4b9f-4971-96be-d28d9f0d5ee5_large.jpg?v=1674275311",
      "//drou-electronics-store.myshopify.com/cdn/shop/products/p5_61c8ce6b-3afa-4276-a285-f98e4d5c7f67_large.jpg?v=1674275311",
    ],
    {
      "Système d'exploitation": "Windows 10",
      Processeur: "Intel Atom",
      "Réf processeur":
        "Intel Atom x5-Z8350 Quad Core, 1,44 GHz jusqu'à 1,92 GHz, 2 Mode mémoire cache",
      "Taille de mémoire": "64Go",
      Mémoire: "2 Go",
      "Disque Dur": "32 Go eMMC",
      "Carte Graphique": "Intel HD Graphics",
      "Taille Ecran": '14"',
      "Type Ecran": "Full HD",
      "Ecran Tactile": "Non",
      Réseau: "WiFi - Bluetooth",
      Caméra: "Webcam avec micro",
      Garantie: "1 An",
      Couleur: "Noir",
      Availability: "Available In stock",
      Access: "oui",
    },
    [
      {
        name: "Oumarou",
        date: "12/04/2024",
        rating: 1,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Ben Arfa",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Arafat",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Product(
    1,
    10,
    15,
    "Smartphone Tecno Spark Go 2024",
    "Téléphonie & Tablette/Smartphone",
    65000,
    5000,
    [
      "https://www.tunisianet.com.tn/382924-large/smartphone-tecno-spark-go-2024-2-go-64-go-blanc.jpg",
      "https://www.tunisianet.com.tn/382924-large/smartphone-tecno-spark-go-2024-2-go-64-go-blanc.jpg",
    ],
    {
      "Double SIM": "Oui",
      Écran: 'Hole Screen 6.67" (720 x 1600 px), 120 Hz',
      Processeur: "Unisoc T615 Octa-core (12 nm)",
      "Mémoire RAM": "4 Go (+ 4 Go étendus)",
      Stockage: "128 Go",
      "Système opérateur": "Android 14 Go",
      Réseau: "4G",
      "Caméra Avant": "8 MP, double flash avant",
      "Caméra Arrière": "13 MP, double flash arrière",
      "Indice de protection": "IP54",
      "Capteur d'empreintes": "Latéral",
      Télécommande: "Infrarouge",
      Batterie: "5000mAh",
      "Charge rapide": "15 W Type C",
      Audio: "Deux haut-parleurs (Son DTS)",
      Couleur: "Vert",
      Garantie: "1 an",
    },
    [
      {
        name: "Mohamed",
        date: "12/04/2024",
        rating: 2,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Ahmed",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Abou",
        date: "12/04/2024",
        rating: 2,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Product(
    2,
    5,
    20,
    "iPhone 14 pro max",
    "Téléphonie & Tablette/Smartphone",
    250000,
    45000,

    [
      "https://drou-electronics-store.myshopify.com/cdn/shop/products/p7_36d931d4-1ef2-4c82-9a65-80426fb77f21_1024x1024.jpg?v=1674275335",
      "https://drou-electronics-store.myshopify.com/cdn/shop/products/p8_523c97c7-2aa2-47e8-8b17-5a3c05a66db3_1024x1024.jpg?v=1674275335",
      "//drou-electronics-store.myshopify.com/cdn/shop/products/p5_61c8ce6b-3afa-4276-a285-f98e4d5c7f67_large.jpg?v=1674275311",
    ],

    {
      Écran: '15.6" Full HD (1920 x 1080), IPS, 144 Hz',
      Processeur:
        "Intel Core i7-13620H 13e génération (jusqu’à 4.9 GHz, 24 Mo de cache)",
      Mémoire: "8 Go DDR5",
      Stockage: "SSD NVMe M.2 512 Go",
      "Carte graphique": "NVIDIA GeForce RTX 4060, 8 Go GDDR6",
      Clavier: "Rétroéclairé simple",
      Webcam: "HD 720p",
      Audio: "2x haut-parleurs 2W, Nahimic 3 Audio Enhancer, Hi-Res Audio",
      Connectique: "2x USB 3.2, 1x USB-C 3.2, 1x HDMI 2.1",
      Réseau: "Gigabit Ethernet - Wi-Fi 6E - Bluetooth 5.3",
      Système: "FreeDos",
      Couleur: "Noir translucide",
      Garantie: "1 an",
    },
    [
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Product(
    0,
    100,
    10,
    "Uphone lightning cable",
    "Téléphonie & Tablette/Accessoirs/Chargeurs & cablés",
    10000,
    0,
    [
      "//drou-electronics-store.myshopify.com/cdn/shop/products/p4_c46c6d30-4b9f-4971-96be-d28d9f0d5ee5_large.jpg?v=1674275311",
      "//drou-electronics-store.myshopify.com/cdn/shop/products/p5_61c8ce6b-3afa-4276-a285-f98e4d5c7f67_large.jpg?v=1674275311",
    ],
    {
      "Système d'exploitation": "Windows 10",
      Processeur: "Intel Atom",
      "Réf processeur":
        "Intel Atom x5-Z8350 Quad Core, 1,44 GHz jusqu'à 1,92 GHz, 2 Mode mémoire cache",
      "Taille de mémoire": "64Go",
      Mémoire: "2 Go",
      "Disque Dur": "32 Go eMMC",
      "Carte Graphique": "Intel HD Graphics",
      "Taille Ecran": '14"',
      "Type Ecran": "Full HD",
      "Ecran Tactile": "Non",
      Réseau: "WiFi - Bluetooth",
      Caméra: "Webcam avec micro",
      Garantie: "1 An",
      Couleur: "Noir",
      Availability: "Available In stock",
      Access: "oui",
    },
    [
      {
        name: "Oumarou",
        date: "12/04/2024",
        rating: 1,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Ben Arfa",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Arafat",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Product(
    1,
    10,
    15,
    "Smartphone Tecno Spark Go 2024",
    "Téléphonie & Tablette/Smartphone",
    65000,
    5000,
    [
      "https://www.tunisianet.com.tn/382924-large/smartphone-tecno-spark-go-2024-2-go-64-go-blanc.jpg",
      "https://www.tunisianet.com.tn/382924-large/smartphone-tecno-spark-go-2024-2-go-64-go-blanc.jpg",
    ],
    {
      "Double SIM": "Oui",
      Écran: 'Hole Screen 6.67" (720 x 1600 px), 120 Hz',
      Processeur: "Unisoc T615 Octa-core (12 nm)",
      "Mémoire RAM": "4 Go (+ 4 Go étendus)",
      Stockage: "128 Go",
      "Système opérateur": "Android 14 Go",
      Réseau: "4G",
      "Caméra Avant": "8 MP, double flash avant",
      "Caméra Arrière": "13 MP, double flash arrière",
      "Indice de protection": "IP54",
      "Capteur d'empreintes": "Latéral",
      Télécommande: "Infrarouge",
      Batterie: "5000mAh",
      "Charge rapide": "15 W Type C",
      Audio: "Deux haut-parleurs (Son DTS)",
      Couleur: "Vert",
      Garantie: "1 an",
    },
    [
      {
        name: "Mohamed",
        date: "12/04/2024",
        rating: 2,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Ahmed",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Abou",
        date: "12/04/2024",
        rating: 2,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Product(
    2,
    5,
    20,
    "iPhone 14 pro max",
    "Téléphonie & Tablette/Smartphone",
    250000,
    45000,

    [
      "https://drou-electronics-store.myshopify.com/cdn/shop/products/p7_36d931d4-1ef2-4c82-9a65-80426fb77f21_1024x1024.jpg?v=1674275335",
      "https://drou-electronics-store.myshopify.com/cdn/shop/products/p8_523c97c7-2aa2-47e8-8b17-5a3c05a66db3_1024x1024.jpg?v=1674275335",
      "//drou-electronics-store.myshopify.com/cdn/shop/products/p5_61c8ce6b-3afa-4276-a285-f98e4d5c7f67_large.jpg?v=1674275311",
    ],

    {
      Écran: '15.6" Full HD (1920 x 1080), IPS, 144 Hz',
      Processeur:
        "Intel Core i7-13620H 13e génération (jusqu’à 4.9 GHz, 24 Mo de cache)",
      Mémoire: "8 Go DDR5",
      Stockage: "SSD NVMe M.2 512 Go",
      "Carte graphique": "NVIDIA GeForce RTX 4060, 8 Go GDDR6",
      Clavier: "Rétroéclairé simple",
      Webcam: "HD 720p",
      Audio: "2x haut-parleurs 2W, Nahimic 3 Audio Enhancer, Hi-Res Audio",
      Connectique: "2x USB 3.2, 1x USB-C 3.2, 1x HDMI 2.1",
      Réseau: "Gigabit Ethernet - Wi-Fi 6E - Bluetooth 5.3",
      Système: "FreeDos",
      Couleur: "Noir translucide",
      Garantie: "1 an",
    },
    [
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
];

var cart = new Cart([
  new CartItem(0, 2),
  new CartItem(1, 1),
  new CartItem(2, 1),
]);

const blogs = [
  new Blog(
    1,
    "Music magnate headphones",

    [
      {
        images: [
          "//drou-electronics-store.myshopify.com/cdn/shop/articles/04_684500ea-e527-4171-8e1a-07c34d71c243_1024x1024.jpg?v=1674279180",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
      {
        images: [
          "assets/images/banner/banner1.jpg",
          "assets/images/banner/banner2.jpg",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
    ],
    "Lorem ipsum dolor sit amet, consecte adipisicing elit, sed do eiusmod tempor incididunt labo dolor magna aliqua. Ut enim ad minim veniam quis nostrud.",
    "12/04/2024",
    12,
    "iphone",
    [
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Blog(
    2,
    "MacBook Air labore et dolore",
    [
      {
        images: [
          "//drou-electronics-store.myshopify.com/cdn/shop/articles/b1_a4c8283b-edba-463f-bcb7-d2cf8f3ce46f_1024x1024.jpg?v=1674279118",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
      {
        images: [
          "assets/images/banner/banner1.jpg",
          "assets/images/banner/banner2.jpg",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
    ],
    "Lorem ipsum dolor sit amet, consecte adipisicing elit, sed do eiusmod tempor incididunt labo dolor magna aliqua. Ut enim ad minim veniam quis nostrud.",
    "12/12/2024",
    15,
    "mac OS",
    [
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Blog(
    3,
    "New iPhone 17 review",
    [
      {
        images: [
          "//drou-electronics-store.myshopify.com/cdn/shop/articles/b2_74c4b7c0-e805-4704-a4ab-4e68c8e4eae2_1024x1024.jpg?v=1674279232",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
      {
        images: [
          "assets/images/banner/banner1.jpg",
          "assets/images/banner/banner2.jpg",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
    ],
    "Lorem ipsum dolor sit amet, consecte adipisicing elit, sed do eiusmod tempor incididunt labo dolor magna aliqua. Ut enim ad minim veniam quis nostrud.",
    "12/04/2024",
    18,
    "iphone",
    [
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Blog(
    4,
    "MacBook Air 3 labore et dolore",
    [
      {
        images: [
          "//drou-electronics-store.myshopify.com/cdn/shop/articles/b1_3b00d3c2-2f39-45bc-8e1c-fa7af69a0a27_1024x1024.jpg?v=1674279260",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
      {
        images: [
          "assets/images/banner/banner1.jpg",
          "assets/images/banner/banner2.jpg",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
    ],
    "Lorem ipsum dolor sit amet, consecte adipisicing elit, sed do eiusmod tempor incididunt labo dolor magna aliqua. Ut enim ad minim veniam quis nostrud.",
    "12/04/2024",
    18,
    "mac OS",
    [
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
  new Blog(
    4,
    "MacBook Air 3 labore et dolore",
    [
      {
        images: [
          "//drou-electronics-store.myshopify.com/cdn/shop/articles/b1_3b00d3c2-2f39-45bc-8e1c-fa7af69a0a27_1024x1024.jpg?v=1674279260",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
      {
        images: ["assets/images/banner/banner1.jpg"],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
      {
        images: ["assets/images/banner/banner2.jpg"],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
      {
        images: [
          "assets/images/banner/banner1.jpg",
          "assets/images/banner/banner2.jpg",
        ],
        description:
          "Le 14 décembre 2023, par Nicolas Roux, l'iPhone 15 pro max est le nouveau smartphone le plus populaire de la marque Apple. Cet appareil est disponible à partir du 15 janvier 2024 et semble être le nouveau produit le plus récent de la gamme.",
      },
    ],
    "Lorem ipsum dolor sit amet, consecte adipisicing elit, sed do eiusmod tempor incididunt labo dolor magna aliqua. Ut enim ad minim veniam quis nostrud.",
    "12/04/2024",
    18,
    "mac OS",
    [
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "AB",
        date: "12/04/2024",
        rating: 5,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Issou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
      {
        name: "Almou",
        date: "12/04/2024",
        rating: 4,
        comment:
          "Si vous souhaitez dès maintenant un téléphone fiable et performant, l'iPhone 15 continue d'être un choix parfait. Si vous souhaitez une option plus avancée et à long terme, vous devriez peut-être envisager d'acheter l'iPhone 16.",
      },
    ]
  ),
];

var orders = new ordersManager([
  new Order(
    0,
    0,
    [
      new orderItem(
        0,
        "Uphone lightning cable",
        "//drou-electronics-store.myshopify.com/cdn/shop/products/p4_c46c6d30-4b9f-4971-96be-d28d9f0d5ee5_large.jpg?v=1674275311",
        10000,
        0,
        1,
        [
          new orderItemHistory("pending", Date.now() - 2 * 24 * 60 * 60 * 1000),
          new orderItemHistory(
            "progress",
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ),
          new orderItemHistory(
            "report-returned",
            Date.now() - 2 * 24 * 60 * 60 * 1000,
            Date.now()
          ),
        ]
      ),
      new orderItem(
        1,
        "iPhone 14 pro max",
        "https://drou-electronics-store.myshopify.com/cdn/shop/products/p7_36d931d4-1ef2-4c82-9a65-80426fb77f21_1024x1024.jpg?v=1674275335",
        200000,
        0,
        1,
        [
          new orderItemHistory("pending", Date.now() - 2 * 24 * 60 * 60 * 1000),
          new orderItemHistory(
            "cancelled",
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ),
        ]
      ),
      new orderItem(
        2,
        "Smartphone Tecno Spark Go 2024",
        "https://www.tunisianet.com.tn/382924-large/smartphone-tecno-spark-go-2024-2-go-64-go-blanc.jpg",
        65000,
        5000,
        2,
        [new orderItemHistory("pending", Date.now())]
      ),
    ],
    user.addresses[0],
    "cash",
    1800000,
    1000,
    "shipped",
    Date.now() - 3 * 24 * 60 * 60 * 1000,
    Date.now()
  ),
  new Order(
    1,
    0,
    [
      new orderItem(
        3,
        "Uphone lightning cable",
        "//drou-electronics-store.myshopify.com/cdn/shop/products/p4_c46c6d30-4b9f-4971-96be-d28d9f0d5ee5_large.jpg?v=1674275311",
        10000,
        0,
        1,
        [
          new orderItemHistory("pending", Date.now() - 2 * 24 * 60 * 60 * 1000),
          new orderItemHistory(
            "progress",
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ),
          new orderItemHistory(
            "report-returned",
            Date.now() - 1 * 24 * 60 * 60 * 1000,
            Date.now()
          ),
        ]
      ),
      new orderItem(
        4,
        "iPhone 14 pro max",
        "https://drou-electronics-store.myshopify.com/cdn/shop/products/p7_36d931d4-1ef2-4c82-9a65-80426fb77f21_1024x1024.jpg?v=1674275335",
        200000,
        0,
        1,
        [
          new orderItemHistory("pending", Date.now() - 2 * 24 * 60 * 60 * 1000),
          new orderItemHistory(
            "cancelled",
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ),
        ]
      ),
      new orderItem(
        5,
        "Smartphone Tecno Spark Go 2024",
        "https://www.tunisianet.com.tn/382924-large/smartphone-tecno-spark-go-2024-2-go-64-go-blanc.jpg",
        65000,
        5000,
        2,
        [new orderItemHistory("pending", Date.now())]
      ),
    ],
    user.addresses[0],
    "virtual-wallet-10248732",
    1800000,
    1000,
    "shipped",
    Date.now() - 3 * 24 * 60 * 60 * 1000,
    Date.now()
  ),
]);

const productManager = new ProductManager(products);

class Filtres {
  constructor() {
    this.categories = [];
  }

  addCategory(category) {
    this.categories.push(category);
  }

  generateFilters() {
    return this.categories;
  }
}

class Category {
  constructor(name) {
    this.name = name;
    this.subCategories = [];
    this.options = [];
  }

  addSubCategory(subCategory) {
    this.subCategories.push(subCategory);
  }

  getSubCategory() {
    return this.subCategories;
  }

  addOption(option) {
    this.options.push(option);
  }

  getOptions() {
    return this.options;
  }
}

class Option {
  constructor(title, values) {
    this.title = title;
    this.values = values;
  }

  getTitle() {
    return this.title;
  }

  getValues() {
    return this.values;
  }
}

class SubCategory extends Category {}

const informatique = new Category("Informatique");

const ordinateurPortable = new SubCategory("Ordinateur Portable");
const ordinateurBureau = new SubCategory("Ordinateur Bureau");
const Iaccessoirs = new SubCategory("Accessoirs et Peripherique");

informatique.addSubCategory(ordinateurPortable);
informatique.addSubCategory(ordinateurBureau);
informatique.addSubCategory(Iaccessoirs);
ordinateurPortable.addOption(new Option("Access", ["oui", "non"]));
ordinateurPortable.addOption(new Option("Stockage", ["SSD", "HDD"]));
informatique.addOption(new Option("Résolution", ["1080p", "2k", "4K"]));
ordinateurPortable.addOption(new Option("Résolution", ["Full HD"]));

ordinateurPortable.addSubCategory(new SubCategory("Pc Portable"));
ordinateurPortable.addSubCategory(new SubCategory("Pc Portable Gamer"));
ordinateurPortable.addSubCategory(new SubCategory("Pc Portable Pro"));

ordinateurBureau.addSubCategory(new SubCategory("Ecran"));
ordinateurBureau.addSubCategory(new SubCategory("Pc Bureau"));
ordinateurBureau.addSubCategory(new SubCategory("Pc Bureau Gamer"));
ordinateurBureau.addSubCategory(new SubCategory("Pc Tout en Un"));

Iaccessoirs.addSubCategory(new SubCategory("Casque"));
Iaccessoirs.addSubCategory(new SubCategory("Sac à Dos"));
Iaccessoirs.addSubCategory(new SubCategory("Souris"));
Iaccessoirs.addSubCategory(new SubCategory("Claviers"));

//Telephonie & Tablette
const telephonieTablette = new Category("Téléphonie & Tablette");
const Taccessoirs = new SubCategory("Accessoirs");

telephonieTablette.addSubCategory(new SubCategory("Telephone Portable"));
telephonieTablette.addSubCategory(new SubCategory("Smartphone"));
telephonieTablette.addSubCategory(new SubCategory("Telephone Fixe"));
telephonieTablette.addSubCategory(new SubCategory("Tablette tactile"));
telephonieTablette.addSubCategory(new SubCategory("Smart Watch"));
telephonieTablette.addSubCategory(Taccessoirs);

Taccessoirs.addSubCategory(new SubCategory("Protection"));
Taccessoirs.addSubCategory(new SubCategory("Chargeurs & cablés"));
Taccessoirs.addSubCategory(new SubCategory("Power Bank"));
Taccessoirs.addSubCategory(new SubCategory("Batterie"));
Taccessoirs.addSubCategory(new SubCategory("Divers"));

//Stockage
const stockage = new Category("Stockage");

stockage.addSubCategory(new SubCategory("Disque Dur internes"));
stockage.addSubCategory(new SubCategory("Disque Dur externes"));
stockage.addSubCategory(new SubCategory("Clé USB"));
stockage.addSubCategory(new SubCategory("Carte mémoire"));

// TV-Son-Console
const tvSonConsole = new Category("TV-Son-Console");
const consoles = new SubCategory("Consoles & Jeux");

tvSonConsole.addSubCategory(new SubCategory("TV"));
tvSonConsole.addSubCategory(new SubCategory("Son"));
tvSonConsole.addSubCategory(new SubCategory("Appareils Photos"));
tvSonConsole.addSubCategory(consoles);
consoles.addSubCategory(new SubCategory("Consoles"));
consoles.addSubCategory(new SubCategory("Manettes de Jeux"));
consoles.addSubCategory(new SubCategory("Disques de Jeux"));

// Sécurite
const securite = new Category("Sécurité");

securite.addSubCategory(new SubCategory("Systèmes & Logiciels Antivirus"));
securite.addSubCategory(new SubCategory("Systèmes de Sécurité"));
securite.addSubCategory(new SubCategory("Caméras"));

// Creation des filtres
const filtres = new Filtres();
filtres.addCategory(informatique);
filtres.addCategory(telephonieTablette);
filtres.addCategory(stockage);
filtres.addCategory(tvSonConsole);
filtres.addCategory(securite);

function generateCategoryList(categories, parentElement, isDesktop = false) {
  categories.forEach((category) => {
    const li = document.createElement("li");
    li.classList.add("category");

    const a = document.createElement("a");
    a.textContent = category.name;
    a.href = `shop.html?category=${encodeURIComponent(category.name)}`;

    const ul = document.createElement("ul");
    ul.classList.add("category-list");
    ul.style.display = isDesktop ? "block" : "none";

    const i = document.createElement("i");
    i.classList.add("fas", "fa-angle-down", "arrowCategory");

    i.addEventListener("click", (event) => {
      event.preventDefault();
      toggleVisibility(ul);
      i.classList.toggle("rot");
    });

    li.appendChild(a);
    !isDesktop ? li.appendChild(i) : null;
    li.appendChild(ul);
    parentElement.appendChild(li);

    generateSubCategoryList(category, ul, isDesktop, [category.name]);
  });
}

function generateSubCategoryList(category, parentElement, isDesktop, path) {
  category.getSubCategory().forEach((subCategory) => {
    const li = document.createElement("li");
    const aSub = document.createElement("a");
    aSub.textContent = subCategory.name;

    const newPath = [...path, subCategory.name];
    aSub.href = `shop.html?category=${encodeURIComponent(newPath.join("/"))}`;

    const ul = document.createElement("ul");
    ul.style.display = isDesktop ? "block" : "none";

    if (subCategory.getSubCategory().length > 0) {
      li.classList.add("sub-category");
    } else {
      li.classList.add("no-sub-category");
    }

    li.appendChild(aSub);
    li.appendChild(ul);
    parentElement.appendChild(li);

    generateSubCategoryList(subCategory, ul, isDesktop, newPath);
  });
}

function toggleVisibility(ul) {
  if (ul.style.display === "none" || ul.style.display === "") {
    ul.style.display = "block";

    ul.querySelectorAll("ul").forEach((subUl) => {
      subUl.style.display = "block";
    });
  } else {
    ul.style.display = "none";

    ul.querySelectorAll("ul").forEach((subUl) => {
      subUl.style.display = "none";
    });
  }
}

const categoryList = document.getElementById("category-list");
const categoryListDesktop = document.getElementById("category-list-desktop");
generateCategoryList(filtres.generateFilters(), categoryList, false);
generateCategoryList(filtres.generateFilters(), categoryListDesktop, true);

// Gestion du préchargement de la page
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader_active");
  if (preloader) {
    preloader.style.transition = "opacity 0.6s ease";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 600); // Correspond à la durée de la transition CSS
  }
});

// Gestion des événements DOM
document.addEventListener("DOMContentLoaded", () => {
  const showMenu = document.getElementById("showMenu");
  const hiddenLink = document.getElementById("hiddenLink");
  const fond = document.getElementById("fond");
  const links = document.getElementById("links-container");
  const hiddenSearch = document.getElementById("hiddenSearch");
  const showSearch = document.getElementById("showSearch");
  const searchBar = document.getElementById("searchBar");
  const fondCategory = document.getElementById("fondCategory");
  const category = document.getElementById("category");
  const showCategory = document.getElementById("showCategory");
  const hiddenCategory = document.getElementById("hiddenCategory");

  showCategory.addEventListener("click", () => {
    fondCategory.classList.toggle("show");
    category.classList.toggle("show");
  });

  hiddenCategory.addEventListener("click", () => {
    fondCategory.classList.toggle("show");
    category.classList.toggle("show");
  });

  // Gestion du menu
  if (showMenu && fond && links) {
    showMenu.addEventListener("click", () => {
      fond.classList.add("show");
      links.classList.add("show");
      document.body.classList.add("modal-open");
    });

    hiddenLink?.addEventListener("click", () => {
      fond.classList.remove("show");
      links.classList.remove("show");
      document.body.classList.remove("modal-open");
    });
  }

  // Gestion de la barre de recherche
  if (hiddenSearch && showSearch && searchBar) {
    hiddenSearch.addEventListener("click", () => {
      searchBar.classList.remove("active");
    });

    showSearch.addEventListener("click", () => {
      searchBar.classList.add("active");
    });
  }
});

// Fonction de debounce pour optimiser les événements fréquents
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

const handleScroll = debounce(() => {
  const header = document.getElementById("header");
  const scrollUp = document.getElementById("scrollUp");
  const headerTop = document.getElementById("headerTop");
  const mediaQuery = window.matchMedia("(min-width: 992px)");

  if (window.scrollY > 20) {
    header?.classList.add("fixed");
    scrollUp?.classList.add("show");

    if (headerTop) {
      headerTop.style.display = "none";
    }
  } else {
    header?.classList.remove("fixed");
    scrollUp?.classList.remove("show");

    if (mediaQuery.matches && headerTop) {
      headerTop.style.display = "flex";
    }
  }
}, 100);

window.addEventListener("scroll", handleScroll);

document.getElementById("scrollUp").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function AddToCart(button, isProduct = false, isWishlist = false) {
  const productElement = isProduct
    ? button.closest(".firstContent")
    : isWishlist
    ? button.closest(".wishlist-card")
    : button.closest(".item");
  const product = {
    image: isProduct
      ? productElement.querySelector("#ProductPhoto").src
      : isWishlist
      ? productElement.querySelector(".product-img").src
      : productElement.querySelector("img").src,
    name: isProduct
      ? productElement.querySelector("#productName1").innerText
      : isWishlist
      ? productElement.querySelector(".product-title").innerText
      : productElement.querySelector(".item-title").innerText,
    price: isProduct
      ? productElement.querySelector("#productPrice").innerText
      : isWishlist
      ? productElement.querySelector(".product-price span").innerText
      : productElement.querySelector(".item-price span").innerText,
    quantity: isProduct
      ? productElement.querySelector(".quantity input").value
      : 1,
  };

  console.log(product);

  let modal = document.getElementById("modalAddToCart");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modalAddToCart";
    modal.className = "modal fade ajax-popup";
    modal.innerHTML = `
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-body">
                  <div class="modal-close">
                  <button type="button" class="close" onclick="closeModal()">
                          <i class="uil uil-times"></i>
                      </button>
                  </div>
                  <div class="modal-content-text">
                      <div class="popup-image">
                          <img class="popupimage" src=${product.image} alt=${product.name}/>
                      </div>
                      <div class="popup-content">
                          <p class="success-message">
                              <span class="fa fa-check-circle"></span> Added to cart successfully!
                          </p>
                          <div class="modal-button">
                              <a href="/cart" class="btn btn-cart">VIEW CART</a>
                              <a href="/checkout" class="btn btn-cart">CHECKOUT</a>
                          </div>
                      </div>
                      <div class="right-popup-content">
                          <p class="total_item">
                              <span class="fa fa-shopping-basket"></span> There are <span class="cart_count bigcounter">${product.quantity}</span> Items In Your Cart.
                          </p>
                          <p class="cart_total">
                              <span class="total_price_label">Total Price: </span>
                              <span class="shopping-cart__total">
                                  <span class="money text-red">${product.price}</span>
                              </span>
                          </p>
                          <div class="continue_btn">
                              <a href="#" onclick="closeModal()"> Continue Shopping </a>
                              <i class="fa fa-arrow-right"></i>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    `;
    document.body.appendChild(modal);
  } else {
    // Mettre à jour le modal avec le produit
    modal.querySelector(".popupimage").src = product.image;
    modal.querySelector(".popupimage").alt = product.name;
    modal.querySelector(".money").textContent = product.price;
    modal.querySelector(".cart_count").textContent = product.quantity;
  }

  modal.classList.add("show");
  document.body.classList.add("modal-open");
}

function closeModal() {
  let modal = document.getElementById("modalAddToCart");
  modal.classList.remove("show");
  document.body.classList.remove("modal-open");
}

function AddToWish(button) {
  const icon = button.querySelector("i");
  if (icon.classList.contains("uil-heart")) {
    icon.classList.remove("uil-heart");
    icon.classList.add("uil-spinner-alt", "rotateIn");

    setTimeout(() => {
      icon.classList.remove("uil-spinner-alt", "rotateIn");
      icon.classList.add("uil-heart");
      button.classList.toggle("favorite");
    }, 2000);
  }
}

function Compare(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  if (compareProducts.some((p) => p.id === productId)) {
    compareProducts = compareProducts.filter((p) => p.id !== productId);
  } else {
    if (compareProducts.length >= 2) {
      compareProducts.shift();
    }
    compareProducts.push(product);
  }

  updateCompareModal();
}

function updateCompareModal() {
  let modalHTML = `
    <div class="modalCompare" id="modalCompare">
      <div class="modalContent">
        <div class="modalCompare-close">
          <button type="button" class="closeCompare" onclick="closeCompareModal()">
            <i class="uil uil-times"></i>
          </button>
        </div>
        <div class="modalBody">
          <table>
            <caption>Compare Product</caption>
            <tbody>`;

  if (compareProducts.length === 0) {
    closeCompareModal();
    return;
  }

  modalHTML += `<tr><th>Action</th>`;
  compareProducts.forEach((product) => {
    modalHTML += `
      <td>
        <button class="compare-remove-btn" onclick="removeFromCompare(${product.id})">
          <i class="uil uil-times"></i>
        </button>
      </td>`;
  });
  modalHTML += `</tr>`;

  modalHTML += `<tr><th>Product Name</th>`;
  compareProducts.forEach((product) => {
    modalHTML += `<td>${product.name}</td>`;
  });
  modalHTML += `</tr>`;

  modalHTML += `<tr><th>Product Image</th>`;
  compareProducts.forEach((product) => {
    modalHTML += `
      <td>
        <img src="${product.images[0]}" alt="${product.name}" />
        <span class="current-price">${formatPrice(product.price)} FCFA</span>
        <a href="${`/product.html?id=${product.id}`}">View product</a>
      </td>`;
  });
  modalHTML += `</tr>`;

  const allSpecs = new Set();
  compareProducts.forEach((product) => {
    if (product.specs) {
      Object.keys(product.specs).forEach((sp) => allSpecs.add(sp));
    }
  });

  allSpecs.forEach((sp) => {
    modalHTML += `<tr><th>${sp}</th>`;
    compareProducts.forEach((product) => {
      modalHTML += `<td>${product.specs?.[sp] || "-"}</td>`;
    });
    modalHTML += `</tr>`;
  });

  modalHTML += `
            </tbody>
          </table>
        </div>
      </div>
    </div>`;

  let existingModal = document.getElementById("modalCompare");
  if (existingModal) {
    existingModal.outerHTML = modalHTML;
  } else {
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  document.getElementById("modalCompare").classList.add("show");
  document.body.classList.add("modal-open");
}

function removeFromCompare(productId) {
  compareProducts = compareProducts.filter((p) => p.id !== productId);
  updateCompareModal();
}

function closeCompareModal() {
  let modal = document.getElementById("modalCompare");
  if (modal) {
    modal.classList.remove("show");
    document.body.classList.remove("modal-open");
  }
}

function formatPrice(price) {
  if (isNaN(price)) return "Invalid price";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function creationProduct(product) {
  return `
    <div class="item">
      <div class="item-image">
        <a href="${`/product.html?id=${product.id}`}">
          <img
            class="popup_cart_image default-img"
            src="${product.images[0]}"
            alt="${product.name}"
          />

          <img
            class="hover-img"
            src="${product.images[1]}"
            alt="${product.name}"
          />
        </a>
        ${
          product.priceReduction
            ? `<span class="item-prev-price">
               <span>-${formatPrice(product.priceReduction)} FCFA</span>
             </span>`
            : ""
        }
      </div>
      <div class="item-body">
        <h2 class="item-title">
          <a href="${`/product.html?id=${product.id}`}">${product.name}</a>
        </h2>
        <div class="item-price">
          <span>${formatPrice(product.price)} FCFA</span>
        </div>
        <div class="item-description">${product.description}</div>
        <div class="product-action">
          <button
            class="action_btn addCart"
            aria-label="Add To Cart"
            onclick="AddToCart(this)"
          >
            <i class="uil uil-shopping-bag"></i>
            <span class="tooltip-text">Add To Cart</span>
          </button>

          <button
            class="action_btn addWishlist"
            aria-label="Add To Wishlist"
            onclick="AddToWish(this)"
          >
            <i class="uil uil-heart"></i>
            <span class="tooltip-text">Add To Wishlist</span>
          </button>
          <button
            class="action_btn compare_btn"
            data-pid="${product.id}"
            aria-label="Compare"
            onclick="Compare(${product.id})"
          >
            <i class="uil uil-signal"></i>
            <span class="tooltip-text">Compare</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function creationBlog(blog) {
  return `
  <div class="blog-wrap mb-30">
    <div class="blog-img">
      <a href="/news.html?id=${blog.id}">
        <img src="${blog.paragraphs[0].images[0]}" alt="${blog.name}" />
      </a>
      <div class="blog-tag">
        <a href="/blogs.html?tag=${blog.tag}">${blog.tag}</a>
      </div>
    </div>
    <div class="blog-content">
      <div class="blog-meta">
        <ul>
          <li><i class="far fa-calendar"></i> ${blog.date}</li>
          <li>
            <i class="uil uil-comment-alt-lines"></i> ${blog.reviews.length} comment(s)
          </li>
        </ul>
      </div>
      <h3>
        <a href="/news.html?id=${blog.id}">${blog.name}</a>
      </h3>
      <div class="blog-btn">
        <a href="/news.html?id=${blog.id}">
          Read more <i class="uil uil-arrow-right"></i>
        </a>
      </div>
    </div>
  </div>
  `;
}

function creationWishItem(product) {
  return `
    <div class="wishlist-card">
      <div class="product-image">
        <a class="product-link" href="${`/product.html?id=${product.id}`}">
          <div class="image-wrapper">
            <img
              class="product-img"
              src="${product.images[0]}"
              alt="${product.name}"
            />
            ${
              product.priceReduction
                ? `<span class="item-prev-price">
                   <span>-${formatPrice(product.priceReduction)} FCFA</span>
                 </span>`
                : ""
            }
          </div>
        </a>
        <div class="wishlist-button">
          <button
            class="wishlist-toggle"
            onclick="toggleWish(this)"
          >
            <i class="uil uil-heart"></i>
          </button>

          <button
            class="cart-toggle"
            onclick="AddToCart(this, false, true)"
          >
            <i class="uil uil-shopping-bag"></i>
          </button>
        </div>
      </div>

      <div class="product-info">
        <h2 class="product-title">
          <a href="${`/product.html?id=${product.id}`}"
            >${product.name}</a
          >
        </h2>
        <div class="product-price">
          <span>${formatPrice(product.price)} FCFA</span>
        </div>
      </div>
    </div>
  `;
}

function toggleWish(button) {
  button.classList.toggle("no-active");
}
