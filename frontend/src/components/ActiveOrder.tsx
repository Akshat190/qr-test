import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  tableNumber: number;
  totalPrice: number;
  timestamp: string;
}

interface ActiveOrderProps {
  order: Order;
  onOrderUpdate: (updatedOrder: Order) => void;
}

export const ActiveOrder = ({ order, onOrderUpdate }: ActiveOrderProps) => {
  const handleDeleteOrder = async () => {
    try {
      await axios.delete(
        `/api/orders/${order._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      onOrderUpdate(order);
      toast.success('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Table {order.tableNumber}</h3>
        <span className="text-sm text-gray-500">
          {new Date(order.timestamp).toLocaleString()}
        </span>
      </div>

      <div className="space-y-4">
        {order.items.map((item) => (
          <div key={item._id} className="flex items-center space-x-4 border-b border-gray-100 pb-4 last:border-0">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={item.image || '/placeholder-food.png'}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-food.png';
                  target.onerror = null; // Prevent infinite loop
                }}
              />
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <span className="font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <div>
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="ml-2 text-lg font-bold text-indigo-600">
            ${order.totalPrice.toFixed(2)}
          </span>
        </div>
        <button
          onClick={handleDeleteOrder}
          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="Delete order"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}; 