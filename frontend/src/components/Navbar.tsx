import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, LogOut, Menu, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20">
          {/* Logo section */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl
                           transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <UtensilsCrossed className="h-8 w-8 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
                           bg-clip-text text-transparent">
                QR Menu
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300"
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300"
            >
              Contact
            </Link>
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center px-6 py-2.5 rounded-full font-medium
                         bg-gradient-to-r from-indigo-600 to-purple-600 text-white
                         hover:from-indigo-700 hover:to-purple-700 transform transition-all
                         duration-300 hover:scale-105 hover:shadow-lg"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/signin"
                className="px-6 py-2.5 rounded-full font-medium
                         bg-gradient-to-r from-indigo-600 to-purple-600 text-white
                         hover:from-indigo-700 hover:to-purple-700 transform transition-all
                         duration-300 hover:scale-105 hover:shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-300"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-lg">
            <div className="flex flex-col space-y-4 px-4">
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-indigo-600 font-medium py-2 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-indigo-600 font-medium py-2 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              {user ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center py-3 rounded-xl font-medium
                           bg-gradient-to-r from-indigo-600 to-purple-600 text-white
                           hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/signin"
                  className="py-3 rounded-xl font-medium text-center
                           bg-gradient-to-r from-indigo-600 to-purple-600 text-white
                           hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
