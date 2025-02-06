import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem, Order } from '../types';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: string;
  restaurantName?: string;
}

interface StoreState {
  cart: CartItem[];
  user: User | null;
  orders: Order[];
  menuItems: MenuItem[];
  addToCart: (item: MenuItem & { quantity: number }) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setUser: (user: User | null) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: "pending" | "completed") => Promise<void>;
  addMenuItem: (item: MenuItem) => void;
  setMenuItems: (items: MenuItem[]) => void;
  calculateTotalRevenue: () => number;
  setOrders: (orders: Order[]) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      user: null,
      orders: [],
      menuItems: [],
      
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
          if (existingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
            };
          }
          return { cart: [...state.cart, { ...item, quantity: 1 }] };
        }),

      removeFromCart: (itemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ cart: [] }),

      setUser: (user) => set({ user }),

      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
        })),

      calculateTotalRevenue: () => {
        const state = get();
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        return state.orders
          .filter(order => 
            order.status === 'completed' && 
            new Date(order.timestamp) >= firstDayOfMonth
          )
          .reduce((total, order) => total + order.totalPrice, 0);
      },

      updateOrderStatus: async (orderId, status) => {
        try {
          const token = localStorage.getItem('token');
          await axios.patch(`/api/orders/${orderId}`, 
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          set((state) => ({
            orders: state.orders.map(order =>
              order._id === orderId ? { ...order, status } : order
            )
          }));
        } catch (error) {
          console.error('Error updating order status:', error);
          throw error;
        }
      },

      addMenuItem: (item: MenuItem) => set((state) => ({
        menuItems: [...state.menuItems, item]
      })),

      setMenuItems: (items) => set({ menuItems: items }),

      setOrders: (orders) => set({ orders }),
    }),
    {
      name: 'cart-store',
    }
  )
);
