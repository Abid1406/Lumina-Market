
import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Category, ChatMessage } from './types';
import { PRODUCTS, CATEGORIES } from './constants';
import { getShoppingAdvice } from './services/geminiService';

// Helper Components
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">({rating})</span>
    </div>
  );
};

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm Aura, your Lumina shopping assistant. Looking for something special today?" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Persistence
  useEffect(() => {
    const savedCart = localStorage.getItem('lumina-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina-cart', JSON.stringify(cart));
  }, [cart]);

  // Filters
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Handlers
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Visual feedback could go here
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiLoading) return;

    const userMsg = aiInput;
    setAiInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsAiLoading(true);

    const response = await getShoppingAdvice(userMsg, cart);
    setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => {setActiveCategory('All'); setSearchQuery('');}}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-200">
                <span className="text-white font-bold text-xl italic">L</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                Lumina Market
              </span>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search 30+ premium products..."
                  className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Section */}
        {activeCategory === 'All' && !searchQuery && (
          <div className="relative rounded-3xl overflow-hidden mb-12 bg-gray-900 aspect-[21/9] flex items-center">
            <img 
              src="https://picsum.photos/seed/hero/1200/500" 
              alt="Hero" 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative px-8 sm:px-12 max-w-2xl">
              <span className="inline-block px-3 py-1 bg-indigo-500/30 backdrop-blur-sm text-indigo-300 rounded-full text-xs font-semibold mb-4 border border-indigo-400/30 uppercase tracking-widest">
                Summer Collection 2024
              </span>
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
                Elevate Your <br/><span className="text-indigo-400">Everyday</span> Life
              </h1>
              <p className="text-gray-300 text-lg mb-8 max-w-lg">
                Discover a curated collection of premium products designed to blend seamless technology with timeless aesthetics.
              </p>
              <button 
                onClick={() => {
                  const el = document.getElementById('products-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Shop Now
              </button>
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as Category)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div id="products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col"
            >
              <div 
                className="relative aspect-square overflow-hidden cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                   <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-gray-900 uppercase tracking-tighter shadow-sm">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                  <span className="font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <StarRating rating={product.rating} />
                  <button 
                    onClick={() => addToCart(product)}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Lumina Market. Designed for Excellence.
          </p>
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide-in-right flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Your Cart ({cartCount})</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex space-x-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between font-medium text-gray-900 mb-1">
                          <h4 className="line-clamp-1">{item.name}</h4>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 text-gray-500 hover:text-indigo-600">-</button>
                            <span className="px-2 text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 text-gray-500 hover:text-indigo-600">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 font-medium hover:underline">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button 
                disabled={cart.length === 0}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
             <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-gray-600 hover:bg-white hover:text-gray-900 transition-all shadow-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="md:w-1/2 h-64 md:h-auto">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="md:w-1/2 p-8 sm:p-12 overflow-y-auto custom-scrollbar">
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider mb-6">
                {selectedProduct.category}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {selectedProduct.name}
              </h2>
              <div className="flex items-center space-x-4 mb-6">
                 <StarRating rating={selectedProduct.rating} />
                 <span className="text-gray-400">|</span>
                 <span className="text-sm text-gray-500">{selectedProduct.reviews} reviews</span>
              </div>
              <p className="text-3xl font-bold text-indigo-600 mb-8">${selectedProduct.price.toFixed(2)}</p>
              <div className="space-y-4 mb-10">
                <h4 className="font-semibold text-gray-900">About this product</h4>
                <p className="text-gray-600 leading-relaxed">
                  {selectedProduct.description}
                  {" "}Elevate your lifestyle with this meticulously crafted piece. Designed with both form and function in mind, it represents the pinnacle of Lumina's quality standards.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Add to Cart
                </button>
                <button className="border-2 border-gray-200 text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Button */}
      <button 
        onClick={() => setIsAiOpen(!isAiOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300"
      >
        {isAiOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* AI Chat Drawer */}
      {isAiOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-[90vw] max-w-sm h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-scale-up">
          <div className="p-4 bg-indigo-600 text-white flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg font-bold">A</span>
            </div>
            <div>
              <h3 className="font-bold text-sm">Aura Assistant</h3>
              <p className="text-[10px] text-indigo-100">Powered by Gemini Intelligence</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isAiLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleAiSubmit} className="p-4 border-t border-gray-100 bg-white">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask Aura for advice..."
                className="w-full bg-gray-100 border-none rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isAiLoading || !aiInput.trim()}
                className="absolute right-2 top-1.5 p-2 text-indigo-600 disabled:text-gray-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Global CSS for animations */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-scale-up {
          animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;
