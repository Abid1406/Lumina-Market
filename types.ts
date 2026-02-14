
export type Category = 'All' | 'Electronics' | 'Fashion' | 'Home' | 'Lifestyle' | 'Wellness';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  description: string;
  image: string;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
