import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-transparent bg-clip-text 
                      bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Get in touch with us for any questions or support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 
                       transform transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text 
                        bg-gradient-to-r from-indigo-600 to-purple-600 mb-8">
              Send us a message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition-all duration-300"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
                        py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700
                        transform transition-all duration-300 hover:scale-105
                        flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                Send Message
              </button>
            </form>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 
                       transform transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text 
                        bg-gradient-to-r from-indigo-600 to-purple-600 mb-8">
              Contact Information
            </h2>
            <div className="space-y-8">
              <div className="group flex items-start gap-4 p-4 rounded-2xl
                           bg-gradient-to-br from-indigo-50 to-purple-50
                           transform transition-all duration-300 hover:scale-105">
                <Mail className="h-6 w-6 text-indigo-600 mt-1 transform transition-transform 
                             duration-300 group-hover:rotate-12" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">support@qrmenu.com</p>
                </div>
              </div>
              <div className="group flex items-start gap-4 p-4 rounded-2xl
                           bg-gradient-to-br from-indigo-50 to-purple-50
                           transform transition-all duration-300 hover:scale-105">
                <Phone className="h-6 w-6 text-indigo-600 mt-1 transform transition-transform 
                             duration-300 group-hover:rotate-12" />
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="group flex items-start gap-4 p-4 rounded-2xl
                           bg-gradient-to-br from-indigo-50 to-purple-50
                           transform transition-all duration-300 hover:scale-105">
                <MapPin className="h-6 w-6 text-indigo-600 mt-1 transform transition-transform 
                             duration-300 group-hover:rotate-12" />
                <div>
                  <h3 className="font-semibold text-gray-900">Address</h3>
                  <p className="text-gray-600">
                    123 Restaurant Street<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};