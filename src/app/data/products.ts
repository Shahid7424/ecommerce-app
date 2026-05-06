import { Product } from "../types/product";

export const sampleProducts: Product[] = [
     {
    id: "1",
    title: "Apple iPhone 15 Pro Max (256GB) - Natural Titanium",
    description: "Built from titanium with an aerospace‑grade alloy. A17 Pro chip delivers blazing performance. Action button for quick access to favorite features.",
    price: 134900,
    originalPrice: 159900,
    discount: 16,
    rating: 4.6,
    reviewCount: 2847,
    images: [
      "https://images.unsplash.com/photo-1696446702061-cbd8ab4929a0?w=600",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600",
    ],
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Apple",
    inStock: true,
    specs: {
      "Display": "6.7-inch Super Retina XDR",
      "Processor": "A17 Pro chip",
      "Camera": "48MP Main, 12MP Ultra Wide",
      "Battery": "Up to 29 hours video playback",
      "Storage": "256GB"
    },
    features: [
      "Titanium design with textured matte glass back",
      "Action button for quick actions",
      "ProMotion 120Hz refresh rate",
      "Always-On display"
    ]
  },
  {
    id: "2",
    title: "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB, 256GB)",
    description: "Meet Galaxy AI. The new Galaxy S24 Ultra with Galaxy AI is designed to revolutionize your experience.",
    price: 129999,
    originalPrice: 139999,
    discount: 7,
    rating: 4.5,
    reviewCount: 1923,
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    ],
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Samsung",
    inStock: true,
    specs: {
      "Display": "6.8-inch QHD+ Dynamic AMOLED",
      "Processor": "Snapdragon 8 Gen 3",
      "RAM": "12GB",
      "Camera": "200MP Main Camera",
      "Battery": "5000mAh"
    },
    features: [
      "200MP camera with Space Zoom",
      "Built-in S Pen",
      "Galaxy AI features",
      "Titanium frame"
    ]
  },
  {
    id: "3",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    description: "Industry-leading noise cancellation with Auto NC Optimizer. Up to 30-hour battery life with quick charging.",
    price: 26990,
    originalPrice: 33990,
    discount: 21,
    rating: 4.7,
    reviewCount: 4521,
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600",
    ],
    category: "Electronics",
    subcategory: "Audio",
    brand: "Sony",
    inStock: true,
    specs: {
      "Type": "Over-Ear Wireless",
      "Battery Life": "30 hours",
      "Connectivity": "Bluetooth 5.2",
      "Weight": "250g"
    },
    features: [
      "Industry-leading noise cancellation",
      "Speak-to-Chat technology",
      "Multipoint connection",
      "Lightweight and comfortable"
    ]
  },
  {
    id: "4",
    title: "Dell XPS 15 Laptop (13th Gen Intel Core i7, 16GB RAM, 512GB SSD)",
    description: "Stunning 15.6-inch 4K OLED display. Powerful performance for creators and professionals.",
    price: 189990,
    originalPrice: 209990,
    discount: 10,
    rating: 4.6,
    reviewCount: 892,
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    ],
    category: "Electronics",
    subcategory: "Laptops",
    brand: "Dell",
    inStock: true,
    specs: {
      "Processor": "13th Gen Intel Core i7",
      "RAM": "16GB DDR5",
      "Storage": "512GB NVMe SSD",
      "Display": "15.6-inch 4K OLED",
      "Graphics": "NVIDIA RTX 4050 6GB"
    }
  },
  {
    id: "5",
    title: "Nike Air Zoom Pegasus 40 Running Shoes",
    description: "Responsive cushioning in the Pegasus provides a soft, springy ride. Enhanced breathability and support.",
    price: 10995,
    originalPrice: 12795,
    discount: 14,
    rating: 4.4,
    reviewCount: 3241,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600",
    ],
    category: "Fashion",
    subcategory: "Footwear",
    brand: "Nike",
    inStock: true,
    specs: {
      "Type": "Running Shoes",
      "Closure": "Lace-Up",
      "Sole": "Rubber",
      "Weight": "280g"
    }
  }
];

