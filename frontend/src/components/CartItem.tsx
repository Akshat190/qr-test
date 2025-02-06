import { Minus, Plus, Trash2, Clock, Info } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { useStore } from '../store/useStore';

interface CartItemProps {
  item: CartItemType & {
    notes?: string;
  };
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useStore();

  return (
    <div className="group relative flex items-center gap-6 p-5 rounded-2xl 
                    hover:bg-gradient-to-r hover:from-purple-50/50 hover:via-pink-50/30 hover:to-purple-50/50
                    transition-all duration-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]">
      {/* Glowing Image Container */}
      <div className="relative w-28 h-28 flex-shrink-0 transform transition-all duration-500
                    group-hover:scale-105 group-hover:rotate-3">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl 
                     opacity-0 group-hover:opacity-75 blur-md transition-all duration-500"></div>
        <img
          src={item.image}
          alt={item.name}
          className="relative w-full h-full object-cover rounded-2xl shadow-md 
                   transition-all duration-500"
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="flex-1 min-w-0">
        {/* Item Name and Remove Button */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg truncate pr-4 
                         group-hover:text-transparent group-hover:bg-clip-text
                         group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 
                         transition-all duration-300">
              {item.name}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-gray-500 mt-1">
                <Clock className="h-4 w-4 mr-1 text-purple-500 animate-pulse" />
                <span className="text-sm">{item.estimatedTime} mins</span>
              </div>
              {item.description && (
                <div className="flex items-center text-gray-500 mt-1">
                  <Info className="h-4 w-4 mr-1 text-purple-500" />
                  <span className="text-sm font-medium">Description available</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all duration-300
                     opacity-0 group-hover:opacity-100 transform hover:scale-110 hover:rotate-12
                     hover:shadow-[0_0_10px_rgba(239,68,68,0.3)]"
            title="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        {item.description && (
          <div className="mb-3 text-sm text-gray-600 bg-gradient-to-r from-purple-50/50 to-pink-50/50 
                       rounded-lg p-3 transform transition-all duration-300
                       group-hover:shadow-[0_0_10px_rgba(168,85,247,0.1)]
                       group-hover:scale-[1.02] line-clamp-2">
            {item.description}
          </div>
        )}

        {/* Price and Quantity Controls */}
        <div className="flex items-center justify-between mt-4">
          {/* Glowing Quantity Controls */}
          <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm 
                       group-hover:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all duration-500">
            <button
              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
              className="p-2 rounded-lg hover:bg-purple-50 transition-all duration-300
                       text-gray-500 hover:text-purple-600 disabled:opacity-50 
                       hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-medium text-gray-700 bg-gray-50 py-1 rounded-md
                         group-hover:bg-gradient-to-r group-hover:from-purple-50 group-hover:to-pink-50">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-2 rounded-lg hover:bg-purple-50 transition-all duration-300
                       text-gray-500 hover:text-purple-600
                       hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Glowing Price */}
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-500">
              ${item.price.toFixed(2)} × {item.quantity}
            </span>
            <span className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-600 
                         bg-clip-text text-transparent transform transition-all duration-300
                         group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Notes */}
        {item.notes && (
          <div className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg p-2
                       group-hover:bg-gradient-to-r group-hover:from-purple-50/50 group-hover:to-pink-50/50
                       transition-all duration-500 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.1)]">
            <span className="font-medium text-gray-700">Note:</span> {item.notes}
          </div>
        )}
      </div>
    </div>
  );
};