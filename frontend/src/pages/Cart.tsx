import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ShoppingBag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CartItem } from '../components/CartItem';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  estimatedTime: number;
  image?: string;
  restaurantId: string;
}

export const Cart = () => {
  const [tableNumber, setTableNumber] = useState('');
  const { cart, clearCart } = useStore();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalTime = Math.max(
    ...cart.map((item) => item.estimatedTime)
  );

  const validateRestaurantId = (cartItems: CartItem[]): string | null => {
    if (cartItems.length === 0) return null;
    
    const firstRestaurantId = cartItems[0].restaurantId;
    if (!firstRestaurantId) {
      throw new Error('Invalid menu item data. Please try adding items to cart again.');
    }
    
    const allSameRestaurant = cartItems.every(item => item.restaurantId === firstRestaurantId);
    
    if (!allSameRestaurant) {
      throw new Error('Items from different restaurants cannot be ordered together');
    }
    
    return firstRestaurantId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber || cart.length === 0) return;

    try {
      const restaurantId = validateRestaurantId(cart);
      
      if (!restaurantId) {
        throw new Error('Restaurant ID not found');
      }

      const order = {
        items: cart.map(item => ({
          menuItem: item.id,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          image: item.image
        })),
        tableNumber: parseInt(tableNumber),
        totalPrice: totalPrice,
        restaurantId
      };

      const response = await axios.post('/api/orders', order);
      const orderId = response.data._id;

      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Unexpected error:', error.message);
        toast.error(error.message);
      }
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">Add some delicious items to get started!</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl
                     hover:from-indigo-700 hover:to-purple-700 transition duration-300 ease-in-out
                     transform hover:-translate-y-1 hover:shadow-lg font-medium"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-indigo-600" />
          Your Cart
        </h1>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="space-y-6 divide-y divide-gray-100">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b">
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <Clock className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Time</p>
                  <p className="font-semibold text-gray-900">{totalTime} mins</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Table Number
                </label>
                <input
                  type="number"
                  id="tableNumber"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 
                           focus:ring-indigo-500 focus:border-indigo-500 transition-colors
                           placeholder:text-gray-400"
                  required
                  min="1"
                  placeholder="Enter your table number"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 
                         rounded-xl hover:from-indigo-700 hover:to-purple-700 transition duration-300 
                         ease-in-out transform hover:-translate-y-1 hover:shadow-lg font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         flex items-center justify-center gap-2"
                disabled={!tableNumber || cart.length === 0}
              >
                <ShoppingBag className="w-5 h-5" />
                Place Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
