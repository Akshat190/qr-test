import { useState, useEffect } from 'react';
import { ShoppingCart, ChefHat, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { MenuCard } from '../components/MenuCard';
import axios from 'axios';

export const Menu = () => {
  const { menuItems, cart, setMenuItems } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = Array.from(new Set(menuItems.map((item) => item.category)));
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/menu-items', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (Array.isArray(response.data)) {
          setMenuItems(response.data);
        } else {
          console.error('Fetched data is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, [setMenuItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Refined Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10 animate-pulse"></div>
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 py-16 relative">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Discover Our Menu
                <span className="block text-2xl md:text-3xl mt-2 text-pink-200 font-medium">
                  Crafted with passion & excellence
                </span>
              </h1>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-8">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-full
                           hover:bg-white/20 transition-all duration-300 flex items-center gap-2
                           text-sm font-medium"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Browse Menu
                </button>
                <Link
                  to="/cart"
                  className="px-6 py-2.5 bg-white text-purple-600 rounded-full hover:bg-purple-50
                           transition-all duration-300 flex items-center gap-2 shadow-lg
                           hover:shadow-xl transform hover:scale-105 text-sm font-medium"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Cart ({totalItems})
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-6">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl 
                            flex items-center justify-center transform rotate-12">
                <ChefHat className="w-12 h-12 text-white/90" />
              </div>
              <div className="w-32 h-32 bg-white/15 backdrop-blur-md rounded-2xl 
                            flex items-center justify-center -rotate-6">
                <UtensilsCrossed className="w-16 h-16 text-white/90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refined Category Navigation */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 py-4 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300
                       text-sm font-medium ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300
                          whitespace-nowrap text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Refined Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        {/* Refined Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
              <div className="w-20 h-20 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Items Found
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Try selecting a different category or view our complete menu
              </p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white
                         rounded-full hover:from-purple-700 hover:to-pink-700 transition-all
                         duration-300 text-sm font-medium shadow-md hover:shadow-lg"
              >
                View All Items
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
