import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import Home from './pages/Home';
// import { Menu } from './pages/Menu';
import { Cart } from './pages/Cart';
import { OrderConfirmation } from './pages/OrderConfirmation';
// import { Dashboard } from './pages/Dashboard';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import PrivateRoute from './components/ProtectedRoute';
import { checkAuth } from './utils/auth';
import { RestaurantMenu } from './pages/RestaurantMenu';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const MenuComponent = lazy(() => import('./pages/Menu'));
const DashboardComponent = lazy(() => import('./pages/Dashboard'));

function App() {
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      {/* <div className="text-white text-xl">Loading...</div> */}
    </div>}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuComponent />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardComponent />
              </PrivateRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/restaurant/:restaurantId/menu" element={<RestaurantMenu />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
