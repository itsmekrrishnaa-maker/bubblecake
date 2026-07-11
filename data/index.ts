export interface Cake {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  trending: boolean;
  popular: boolean;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  emoji: string;
  description: string;
}

export const cakes: Cake[] = [
  {
    id: "birthday-1",
    name: "Rainbow Delight",
    category: "birthday",
    price: 1500,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
    description: "Colorful layered cake with rainbow cream frosting",
    trending: true,
    popular: true
  },
  {
    id: "birthday-2",
    name: "Chocolate Dream",
    category: "birthday",
    price: 1800,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
    description: "Rich chocolate cake with dark ganache",
    trending: true,
    popular: true
  },
  {
    id: "birthday-3",
    name: "Strawberry Bliss",
    category: "birthday",
    price: 1600,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800",
    description: "Fresh strawberry cake with cream filling",
    trending: false,
    popular: true
  },
  {
    id: "birthday-4",
    name: "Vanilla Cloud",
    category: "birthday",
    price: 1400,
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800",
    description: "Light vanilla sponge with whipped cream",
    trending: true,
    popular: false
  },
  {
    id: "anniversary-1",
    name: "Rose Romance",
    category: "anniversary",
    price: 2200,
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800",
    description: "Elegant cake with rose petal decoration",
    trending: true,
    popular: true
  },
  {
    id: "anniversary-2",
    name: "Red Velvet Passion",
    category: "anniversary",
    price: 2500,
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800",
    description: "Classic red velvet with cream cheese frosting",
    trending: true,
    popular: true
  },
  {
    id: "anniversary-3",
    name: "Golden Celebration",
    category: "anniversary",
    price: 2800,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
    description: "Premium cake with gold leaf accents",
    trending: false,
    popular: true
  },
  {
    id: "kids-1",
    name: "Teddy Bear Cake",
    category: "kids",
    price: 1800,
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800",
    description: "Adorable teddy bear shaped cake for kids",
    trending: true,
    popular: true
  },
  {
    id: "kids-2",
    name: "Princess Castle",
    category: "kids",
    price: 2000,
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800",
    description: "Magical castle cake for little princesses",
    trending: true,
    popular: false
  },
  {
    id: "kids-3",
    name: "Dinosaur Adventure",
    category: "kids",
    price: 1900,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
    description: "Fun dinosaur themed cake",
    trending: false,
    popular: true
  },
  {
    id: "custom-1",
    name: "Photo Cake",
    category: "custom",
    price: 2500,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800",
    description: "Custom cake with your favorite photo",
    trending: true,
    popular: true
  },
  {
    id: "custom-2",
    name: "Number Cake",
    category: "custom",
    price: 2000,
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800",
    description: "Cakes shaped like your age number",
    trending: true,
    popular: true
  },
  {
    id: "bento-1",
    name: "Bento Chocolate Lava",
    category: "bento",
    price: 800,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800",
    description: "Mini chocolate lava cake with molten center",
    trending: true,
    popular: true
  },
  {
    id: "bento-2",
    name: "Bento Tiramisu",
    category: "bento",
    price: 850,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800",
    description: "Classic tiramisu in a cute bento box",
    trending: true,
    popular: false
  },
  {
    id: "bento-3",
    name: "Bento Strawberry Cheesecake",
    category: "bento",
    price: 900,
    image: "https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=800",
    description: "Creamy cheesecake topped with fresh strawberries",
    trending: false,
    popular: true
  },
  {
    id: "bento-4",
    name: "Bento Matcha Green Tea",
    category: "bento",
    price: 850,
    image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800",
    description: "Japanese matcha flavored bento cake",
    trending: true,
    popular: true
  },
  {
    id: "bento-5",
    name: "Bento Red Velvet",
    category: "bento",
    price: 950,
    image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800",
    description: "Mini red velvet with cream cheese frosting",
    trending: false,
    popular: true
  }
];

export const addons: Addon[] = [
  {
    id: "popper",
    name: "Popper",
    price: 150,
    emoji: "🎉",
    description: "Celebration popper for the party"
  },
  {
    id: "candle",
    name: "Candle Set",
    price: 100,
    emoji: "🕯️",
    description: "Set of colorful birthday candles"
  },
  {
    id: "spray",
    name: "Spray",
    price: 200,
    emoji: "🎊",
    description: "Party spray for celebration"
  },
  {
    id: "curtain",
    name: "Curtain",
    price: 250,
    emoji: "🎀",
    description: "Decorative backdrop curtain"
  },
  {
    id: "topper",
    name: "Birthday Topper",
    price: 180,
    emoji: "🎂",
    description: "Happy Birthday cake topper"
  }
];
