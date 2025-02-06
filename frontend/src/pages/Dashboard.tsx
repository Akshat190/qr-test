import React, { useState, useEffect, useCallback } from 'react';
import {  PlusCircle, Clock, Download, Loader, DollarSign, RefreshCw, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { MenuItem, Order } from '../types';
// import { generateOrdersExcel } from '../utils/excelExport';
import toast from 'react-hot-toast';
import QRCodeGenerator from '../components/QRCodeGenerator';

axios.defaults.baseURL = 'http://localhost:5000'; // Update this to match your backend server's URL

interface OrderItem {
  menuItem: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export const Dashboard = () => {
  const { addMenuItem, user, calculateTotalRevenue } = useStore();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    estimatedTime: '',
    category: '',
    image: '',
  });

  const [categories] = useState([
    'Appetizers', 
    'Soups', 
    'Salads', 
    'Main Courses', 
    'Desserts', 
    'Beverages', 
    'Specials'
  ]);

  const totalRevenue = calculateTotalRevenue();

  const [isExporting, setIsExporting] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from(
    { length: 5 }, 
    (_, i) => new Date().getFullYear() - i
  );

  const [revenue, setRevenue] = useState(0);
  const [lastReset, setLastReset] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRevenue = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/restaurant/${user.id}/revenue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRevenue(response.data.revenue);
      setLastReset(new Date(response.data.lastReset));
    } catch (error) {
      console.error('Error fetching revenue:', error);
      toast.error('Failed to fetch revenue');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  const handleResetRevenue = async () => {
    if (!window.confirm('Are you sure you want to reset the revenue? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/restaurant/${user?.id}/reset-revenue`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRevenue(response.data.revenue);
      setLastReset(new Date(response.data.lastReset));
      toast.success('Revenue reset successfully');
    } catch (error) {
      console.error('Error resetting revenue:', error);
      toast.error('Failed to reset revenue');
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const newItemWithId = {
        id: uuidv4(),
        name: newItem.name,
        description: newItem.description,
        price: Number(newItem.price),
        estimatedTime: Number(newItem.estimatedTime),
        category: newItem.category,
        image: newItem.image,
        restaurantId: user?.id
      };
      
      const response = await axios.post(
        '/api/menu-items',
        newItemWithId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      addMenuItem(response.data);
      setMenuItems(prev => [...prev, response.data]);
      setIsAddingItem(false);
      setNewItem({
        name: '',
        description: '',
        price: '',
        estimatedTime: '',
        category: '',
        image: '',
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Failed to add menu item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    // console.log('Deleting item with id:', id); 
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/menu-items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting menu item:', error);
    };
  };

  const fetchActiveOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/orders/active', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('Active orders:', response.data);
      setActiveOrders(response.data);
      useStore.getState().setOrders(response.data);
    } catch (error) {
      console.error('Error fetching active orders:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setActiveOrders((prevOrders) => prevOrders.filter((o) => o._id !== orderId));
      const filteredOrders = useStore.getState().orders.filter((o) => o._id !== orderId);
      useStore.getState().setOrders(filteredOrders);
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order. Please try again.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('/api/menu-items', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMenuItems(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.error('Authentication failed. Please log in again.');
          localStorage.removeItem('token');
          // Optionally redirect to login page
        } else {
          console.error('Error fetching menu items:', error);
        }
      }
    };

    fetchData();
    fetchActiveOrders();
  }, []);

  const handleExportMonthlyOrders = async () => {
    try {
      setIsExporting(true);
      toast.loading('Generating monthly report...');
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/orders/monthly`, {
        params: {
          month: selectedMonth,
          year: selectedYear
        },
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders-${months[selectedMonth]}-${selectedYear}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.dismiss();
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export monthly report');
    } finally {
      setIsExporting(false);
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Update local state
      setActiveOrders(prevOrders => 
        prevOrders.filter(order => order._id !== orderId)
      );
      
      toast.success('Order completed successfully');
      // Refresh revenue display
      fetchRevenue();
    } catch (error) {
      console.error('Error completing order:', error);
      toast.error('Failed to complete order');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Welcome Header */}
        {user && user.role === 'owner' && user.restaurantName && (
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
              Welcome back, {user.restaurantName}!
            </h1>
            <p className="text-gray-600">Manage your restaurant's operations from one place</p>
          </div>
        )}

        {/* Enhanced Statistics Cards with Revenue */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Total Revenue
              </h3>
              <button
                onClick={handleResetRevenue}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Reset
              </button>
            </div>
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 rounded-lg"></div>
            ) : (
              <>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ${revenue.toFixed(2)}
                </p>
                {lastReset && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                    <Calendar className="h-3 w-3" />
                    Last reset: {new Date(lastReset).toLocaleDateString()}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Menu Items Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span className="h-2 w-2 bg-indigo-500 rounded-full"></span>
              Menu Items
            </h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {menuItems.length}
            </p>
            <p className="text-xs text-gray-500 mt-2">Total items on your menu</p>
          </div>

          {/* Active Orders Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span className="h-2 w-2 bg-purple-500 rounded-full"></span>
              Pending Orders
            </h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {activeOrders.length}
            </p>
            <p className="text-xs text-gray-500 mt-2">Orders waiting to be completed</p>
          </div>
        </div>

        {/* Main Content Grid with enhanced styling */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-8">
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                Active Orders
              </h2>
              
              <div className="space-y-6">
                {activeOrders.map((order) => (
                  <div 
                    key={order._id} 
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-lg">Table {order.tableNumber}</h3>
                          <p className="text-sm text-gray-500">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(order.timestamp).toLocaleTimeString()}
                          </p>
                          <p className="font-medium text-green-600">
                            ${order.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items List - Without remove buttons */}
                    <div className="divide-y divide-gray-100">
                      {order.items.map((item: OrderItem) => (
                        <div 
                          key={item.menuItem}
                          className="p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {item.name}
                                </h4>
                                <span className="font-medium text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">
                                  Quantity: {item.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Cancel Order
                        </button>
                      </div>
                      <button
                        onClick={() => handleOrderStatusChange(order._id, 'completed')}
                        className="px-4 py-2 bg-green-600 text-white rounded-md 
                                 hover:bg-green-700 transition-colors font-medium"
                      >
                        Complete Order
                      </button>
                    </div>
                  </div>
                ))}

                {activeOrders.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No active orders</p>
                    <p className="text-gray-400 text-sm mt-1">
                      New orders will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - QR Code and Menu Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* QR Code Section */}
            {user && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                    Restaurant QR Code
                  </h2>
                  <div className="transform scale-90 origin-top">
                    <QRCodeGenerator 
                      restaurantId={user.id}
                      restaurantName={user.restaurantName || 'Restaurant'}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Menu Management Section */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                  Menu Management
                </h2>
                <button
                  onClick={() => setIsAddingItem(true)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-all duration-300 text-sm shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Item
                </button>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">{item.description}</p>
                      <p className="text-gray-500">${Number(item.price).toFixed(2)}</p>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {menuItems.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">No menu items added yet</p>
                    <p className="text-xs text-gray-400 mt-1">Click 'Add Item' to get started</p>
                  </div>
                )}
              </div>

              {/* Add Item Form - More Compact */}
              {isAddingItem && (
                <form onSubmit={handleAddItem} className="space-y-3 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Item name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Estimated time (minutes)"
                      value={newItem.estimatedTime}
                      onChange={(e) => setNewItem({ ...newItem, estimatedTime: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={newItem.image}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                      Save Item
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingItem(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section - Export Orders with enhanced styling */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left side - Title and Description */}
            <div className="p-6 lg:border-r border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Export Orders</h2>
                  <p className="text-gray-500 text-sm mt-1">Download your monthly order reports</p>
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Select Period</label>
                  <div className="flex gap-3">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="flex-1 border rounded-lg px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-600"
                    >
                      {months.map((month, index) => (
                        <option key={month} value={index}>{month}</option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="flex-1 border rounded-lg px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-600"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Stats and Export Button */}
            <div className="p-6 bg-gray-50 rounded-r-xl">
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {activeOrders.length}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${totalRevenue.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Export Button */}
                <div>
                  <button
                    onClick={handleExportMonthlyOrders}
                    disabled={isExporting}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg
                      ${isExporting 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90 shadow-sm'
                      }
                      transition-all duration-300`}
                  >
                    {isExporting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Generating Report...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Export {months[selectedMonth]} {selectedYear} Report</span>
                      </>
                    )}
                  </button>
                  {!isExporting && (
                    <p className="text-center text-sm text-gray-500 mt-3">
                      Downloads as Excel file (.xlsx)
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Report includes:</p>
                  <ul className="space-y-2">
                    {['Order details', 'Customer information', 'Revenue analytics', 'Popular items'].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
