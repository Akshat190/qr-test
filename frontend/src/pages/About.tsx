// import React from 'react';
import { Users, Heart, Coffee } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-transparent bg-clip-text 
                      bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
            About Us
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Revolutionizing the dining experience through innovative technology
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden mb-16 
                      transform transition-all duration-300 hover:shadow-2xl">
          <div className="relative h-80 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
            <img
              src="https://images.unsplash.com/photo-1498837167922-ddd27525d352"
              alt="Restaurant"
              className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="p-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-10 leading-relaxed">
              Founded in 2024, QR Menu was born from a simple idea: make dining more
              efficient and enjoyable for both customers and restaurant owners. We
              believe in leveraging technology to create seamless experiences that
              enhance the traditional dining experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50
                           transform transition-all duration-300 hover:scale-105">
                <Users className="h-10 w-10 mx-auto text-indigo-600 mb-4 transform transition-transform 
                              duration-300 group-hover:rotate-12" />
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 
                           bg-clip-text text-transparent">500+</h3>
                <p className="text-gray-600">Restaurants</p>
              </div>
              <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50
                           transform transition-all duration-300 hover:scale-105">
                <Heart className="h-10 w-10 mx-auto text-indigo-600 mb-4 transform transition-transform 
                              duration-300 group-hover:rotate-12" />
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 
                           bg-clip-text text-transparent">50,000+</h3>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50
                           transform transition-all duration-300 hover:scale-105">
                <Coffee className="h-10 w-10 mx-auto text-indigo-600 mb-4 transform transition-transform 
                              duration-300 group-hover:rotate-12" />
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 
                           bg-clip-text text-transparent">1M+</h3>
                <p className="text-gray-600">Orders Served</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 
                      transform transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text 
                      bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We're committed to transforming the restaurant industry by providing
            innovative solutions that make dining out more enjoyable and efficient.
            Our platform helps restaurants streamline their operations while
            offering customers a modern, contactless ordering experience.
          </p>
        </div>
      </div>
    </div>
  );
};