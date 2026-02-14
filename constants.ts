
import { Product } from './types';

export const CATEGORIES: string[] = ['All', 'Electronics', 'Fashion', 'Home', 'Lifestyle', 'Wellness'];

export const PRODUCTS: Product[] = [
  // Electronics
  { id: 1, name: "SonicPro Wireless Headphones", price: 299.99, category: "Electronics", description: "Experience studio-quality sound with active noise cancellation.", image: "https://picsum.photos/seed/elec1/600/600", rating: 4.8, reviews: 124 },
  { id: 2, name: "Lumina Smart Watch Gen 3", price: 199.50, category: "Electronics", description: "Track your health metrics in style with 7-day battery life.", image: "https://picsum.photos/seed/elec2/600/600", rating: 4.6, reviews: 89 },
  { id: 3, name: "NanoCharge Portable Power", price: 59.99, category: "Electronics", description: "Ultra-compact 20,000mAh battery with fast charging support.", image: "https://picsum.photos/seed/elec3/600/600", rating: 4.7, reviews: 210 },
  { id: 4, name: "PixelPerfect 4K Monitor", price: 449.00, category: "Electronics", description: "Vivid colors and sharp detail for professionals and gamers.", image: "https://picsum.photos/seed/elec4/600/600", rating: 4.9, reviews: 56 },
  { id: 5, name: "SilentKey Mechanical Keyboard", price: 129.99, category: "Electronics", description: "Tactile feel without the noise. Hot-swappable switches.", image: "https://picsum.photos/seed/elec5/600/600", rating: 4.5, reviews: 145 },
  { id: 6, name: "SwiftPoint Gaming Mouse", price: 79.99, category: "Electronics", description: "Ultra-lightweight design with 25k DPI optical sensor.", image: "https://picsum.photos/seed/elec6/600/600", rating: 4.8, reviews: 302 },

  // Fashion
  { id: 7, name: "AeroWeave Active Tee", price: 45.00, category: "Fashion", description: "Breathable, moisture-wicking fabric for peak performance.", image: "https://picsum.photos/seed/fash1/600/600", rating: 4.4, reviews: 88 },
  { id: 8, name: "Urban Explorer Backpack", price: 110.00, category: "Fashion", description: "Water-resistant, anti-theft design with padded laptop sleeve.", image: "https://picsum.photos/seed/fash2/600/600", rating: 4.7, reviews: 156 },
  { id: 9, name: "Prism Polarized Sunglasses", price: 85.00, category: "Fashion", description: "Classic aviator style with modern UV400 protection.", image: "https://picsum.photos/seed/fash3/600/600", rating: 4.3, reviews: 72 },
  { id: 10, name: "CloudStep Runners", price: 135.00, category: "Fashion", description: "Lightweight foam cushioning for all-day comfort.", image: "https://picsum.photos/seed/fash4/600/600", rating: 4.6, reviews: 198 },
  { id: 11, name: "Heritage Denim Jacket", price: 95.00, category: "Fashion", description: "Timeless style crafted from premium organic cotton.", image: "https://picsum.photos/seed/fash5/600/600", rating: 4.5, reviews: 114 },
  { id: 12, name: "Merino Wool Beanie", price: 35.00, category: "Fashion", description: "Soft, warm, and naturally odor-resistant winter essential.", image: "https://picsum.photos/seed/fash6/600/600", rating: 4.9, reviews: 243 },

  // Home
  { id: 13, name: "ZenSphere Aroma Diffuser", price: 49.00, category: "Home", description: "Ultrasonic mist technology with color-changing LED glow.", image: "https://picsum.photos/seed/home1/600/600", rating: 4.7, reviews: 167 },
  { id: 14, name: "Edison Minimalist Desk Lamp", price: 65.00, category: "Home", description: "Industrial aesthetic with adjustable brightness control.", image: "https://picsum.photos/seed/home2/600/600", rating: 4.4, reviews: 93 },
  { id: 15, name: "ComfyCloud Weighted Blanket", price: 149.00, category: "Home", description: "Reduces stress and improves sleep with even pressure.", image: "https://picsum.photos/seed/home3/600/600", rating: 4.8, reviews: 312 },
  { id: 16, name: "Smart Herb Garden", price: 89.00, category: "Home", description: "Automatic watering and lighting for fresh herbs year-round.", image: "https://picsum.photos/seed/home4/600/600", rating: 4.6, reviews: 128 },
  { id: 17, name: "Velvet Accent Pillow Set", price: 42.00, category: "Home", description: "Luxurious texture and vibrant colors to elevate your sofa.", image: "https://picsum.photos/seed/home5/600/600", rating: 4.5, reviews: 81 },
  { id: 18, name: "Bamboo Bath Mat", price: 38.00, category: "Home", description: "Sustainable, mold-resistant, and naturally beautiful.", image: "https://picsum.photos/seed/home6/600/600", rating: 4.2, reviews: 56 },

  // Lifestyle
  { id: 19, name: "HydraFlow Stainless Bottle", price: 32.00, category: "Lifestyle", description: "Keeps drinks cold for 24 hours or hot for 12 hours.", image: "https://picsum.photos/seed/life1/600/600", rating: 4.9, reviews: 450 },
  { id: 20, name: "Nomad Travel Journal", price: 28.00, category: "Lifestyle", description: "Genuine leather cover with refillable premium paper pages.", image: "https://picsum.photos/seed/life2/600/600", rating: 4.7, reviews: 104 },
  { id: 21, name: "Bamboo Cutlery Set", price: 18.50, category: "Lifestyle", description: "Portable, eco-friendly alternative to single-use plastics.", image: "https://picsum.photos/seed/life3/600/600", rating: 4.5, reviews: 215 },
  { id: 22, name: "Canvas Weekend Tote", price: 55.00, category: "Lifestyle", description: "Heavy-duty canvas for your groceries or a short getaway.", image: "https://picsum.photos/seed/life4/600/600", rating: 4.4, reviews: 137 },
  { id: 23, name: "Pocket Multi-Tool", price: 45.00, category: "Lifestyle", description: "12 essential functions in one compact, rugged design.", image: "https://picsum.photos/seed/life5/600/600", rating: 4.6, reviews: 89 },
  { id: 24, name: "Instant Film Camera", price: 99.00, category: "Lifestyle", description: "Capture and print memories instantly in vintage style.", image: "https://picsum.photos/seed/life6/600/600", rating: 4.3, reviews: 162 },

  // Wellness
  { id: 25, name: "Aura Meditation Cushion", price: 55.00, category: "Wellness", description: "Ergonomic support for comfortable, focused sessions.", image: "https://picsum.photos/seed/well1/600/600", rating: 4.8, reviews: 74 },
  { id: 26, name: "DeepTissue Massage Gun", price: 179.99, category: "Wellness", description: "Quiet motor with 5 speed levels for muscle recovery.", image: "https://picsum.photos/seed/well2/600/600", rating: 4.7, reviews: 289 },
  { id: 27, name: "Organic Matcha Starter Kit", price: 42.00, category: "Wellness", description: "Ceremonial grade matcha with whisk and ceramic bowl.", image: "https://picsum.photos/seed/well3/600/600", rating: 4.9, reviews: 118 },
  { id: 28, name: "High-Grip Yoga Mat", price: 75.00, category: "Wellness", description: "Non-slip surface with alignment lines for perfect poses.", image: "https://picsum.photos/seed/well4/600/600", rating: 4.6, reviews: 204 },
  { id: 29, name: "Sunrise Alarm Clock", price: 68.00, category: "Wellness", description: "Wakes you up gently with simulated morning sunlight.", image: "https://picsum.photos/seed/well5/600/600", rating: 4.5, reviews: 142 },
  { id: 30, name: "Jade Face Roller & Gua Sha", price: 29.99, category: "Wellness", description: "Natural stone tools for cooling and depuffing the skin.", image: "https://picsum.photos/seed/well6/600/600", rating: 4.4, reviews: 96 }
];
