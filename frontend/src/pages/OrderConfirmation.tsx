import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Utensils, Bell, Clock, ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface OrderData {
  tableNumber: number;
  items: Array<{
    name: string;
    quantity: number;
    image?: string;
    price: number;
  }>;
  totalPrice: number;
}

export const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        setOrderData(response.data);
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 text-center">
            <div className="animate-bounce">
              <CheckCircle className="w-16 h-16 text-white mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-white mt-4">Order Confirmed!</h1>
            <p className="text-green-50 mt-2">Your delicious meal is being prepared</p>
          </div>
          
          {/* Table Number */}
          <div className="p-6">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-300">
              <Utensils className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
              <p className="text-indigo-600 font-medium">Your Table</p>
              <p className="text-5xl font-bold text-indigo-700 mt-2">{orderData.tableNumber}</p>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <Clock className="w-6 h-6 text-indigo-600" />
              Order Summary
            </h2>
            
            <div className="space-y-4">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shadow-md" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Utensils className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-600">Total Amount</span>
                <span className="text-3xl font-bold text-indigo-600">
                  ${orderData.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Card */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-6 flex items-center gap-4 shadow-lg">
          <div className="bg-yellow-100 rounded-full p-3">
            <Bell className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-yellow-800 font-medium">
            We'll notify you when your order is ready to be served!
          </p>
        </div>

        {/* Back to Menu Button */}
        <Link
          to="/menu"
          className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-center font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex items-center justify-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Menu
          </div>
        </Link>
      </div>
    </div>
  );
};
