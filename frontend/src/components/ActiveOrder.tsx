import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
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
      
      onOrderUpdate(order); // This will trigger a refresh of the orders list
      toast.success('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Table {order.tableNumber}</h3>
        <button
          onClick={handleDeleteOrder}
          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="Delete order"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {order.items.map((item) => (
          <div key={item._id} className="flex justify-between items-center">
            <div>
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-500 ml-2">x{item.quantity}</span>
            </div>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <span className="font-semibold">Total:</span>
        <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}; 