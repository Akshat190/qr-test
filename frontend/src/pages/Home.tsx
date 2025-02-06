// import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, LayoutDashboard, UtensilsCrossed, Star, Clock } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="relative h-[700px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 z-10"></div>
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-30 z-20"></div>
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
          alt="Restaurant"
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-30 px-4">
          <div className="bg-black/30 backdrop-blur-sm p-10 rounded-3xl max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
              Welcome to
              <span className="block mt-3 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text 
                           text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]
                           font-extrabold">
                QR Menu
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white leading-relaxed font-light">
              Experience the future of dining with our
              <span className="block mt-2 font-medium text-transparent bg-clip-text 
                           bg-gradient-to-r from-purple-200 to-pink-200">
                digital menu system
              </span>
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/menu"
                className="group bg-white/90 backdrop-blur-sm text-indigo-600 px-8 py-4 rounded-full 
                        hover:bg-white flex items-center text-base font-bold transform transition-all 
                        duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                <UtensilsCrossed className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Explore Menu
              </Link>
              <Link
                to="/dashboard"
                className="group bg-transparent text-white px-8 py-4 rounded-full border-2 
                        border-white/80 hover:bg-white/20 flex items-center text-base font-bold
                        backdrop-blur-sm transform transition-all duration-300 
                        hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <LayoutDashboard className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tight">
          Why Choose Us
          <span className="block mt-4 text-xl md:text-2xl font-light text-transparent 
                        bg-clip-text bg-gradient-to-r from-purple-100 to-pink-100">
            Experience the Difference
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl 
                       hover:bg-gradient-to-br hover:from-white hover:to-purple-50
                       transition-all duration-500 transform hover:scale-105 hover:-rotate-1">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl 
                         opacity-0 group-hover:opacity-50 blur-lg transition-all duration-500 -z-10"></div>
            <div className="bg-purple-600/10 p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:bg-purple-600 
                         transition-colors duration-500 rotate-3 group-hover:rotate-12">
              <QrCode className="h-12 w-12 text-purple-200 group-hover:text-white transition-colors duration-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gray-900 text-center
                        tracking-tight">
              Contactless Ordering
            </h3>
            <p className="text-base text-purple-100 group-hover:text-gray-600 text-center leading-relaxed
                       font-light">
              Scan QR code to view menu and place orders directly from your table
            </p>
          </div>

          <div className="group relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl 
                       hover:bg-gradient-to-br hover:from-white hover:to-purple-50
                       transition-all duration-500 transform hover:scale-105">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl 
                         opacity-0 group-hover:opacity-50 blur-lg transition-all duration-500 -z-10"></div>
            <div className="bg-purple-600/10 p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:bg-purple-600 
                         transition-colors duration-500 rotate-3 group-hover:rotate-12">
              <Clock className="h-12 w-12 text-purple-200 group-hover:text-white transition-colors duration-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gray-900 text-center
                        tracking-tight">
              Real-time Updates
            </h3>
            <p className="text-base text-purple-100 group-hover:text-gray-600 text-center leading-relaxed
                       font-light">
              Track your order status and get instant notifications
            </p>
          </div>

          <div className="group relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl 
                       hover:bg-gradient-to-br hover:from-white hover:to-purple-50
                       transition-all duration-500 transform hover:scale-105 hover:rotate-1">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl 
                         opacity-0 group-hover:opacity-50 blur-lg transition-all duration-500 -z-10"></div>
            <div className="bg-purple-600/10 p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:bg-purple-600 
                         transition-colors duration-500 rotate-3 group-hover:rotate-12">
              <Star className="h-12 w-12 text-purple-200 group-hover:text-white transition-colors duration-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gray-900 text-center
                        tracking-tight">
              Easy Management
            </h3>
            <p className="text-base text-purple-100 group-hover:text-gray-600 text-center leading-relaxed
                       font-light">
              Efficiently manage your menu and track orders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};