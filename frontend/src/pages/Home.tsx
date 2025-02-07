// import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, ArrowRight, Smartphone, Users, ChefHat, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="relative h-[700px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 z-10"></div>
        <div className="absolute inset-0 opacity-30 z-20 bg-[url('data:image/svg+xml,...')]"></div>
        <img
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3"
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

      <div className="max-w-7xl mx-auto px-4 py-24 relative">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20 relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
            Get Started in Minutes
            <span className="block mt-4 text-xl md:text-2xl font-light text-purple-200">
              Four simple steps to digitize your menu
            </span>
          </h2>
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            {
              step: 1,
              title: "Sign Up",
              description: "Create your restaurant account in seconds",
              icon: <LayoutDashboard className="w-6 h-6" />,
              image: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-4.0.3",
              color: "from-blue-400 to-indigo-500",
              features: ["Quick registration", "Easy verification", "Secure access"]
            },
            {
              step: 2,
              title: "Add Your Menu",
              description: "Upload your dishes with photos and prices",
              icon: <UtensilsCrossed className="w-6 h-6" />,
              image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3",
              color: "from-indigo-400 to-purple-500",
              features: ["Upload photos", "Set prices", "Organize categories"]
            },
            {
              step: 3,
              title: "Generate QR Code",
              description: "Get your unique restaurant QR code",
              icon: <Smartphone className="w-6 h-6" />,
              image: "https://plus.unsplash.com/premium_photo-1681293215212-2a7f852e44ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              color: "from-purple-400 to-pink-500",
              features: ["Instant generation", "Easy to print", "Customizable design"]
            },
            {
              step: 4,
              title: "Start Serving",
              description: "Place QR codes and start accepting orders",
              icon: <ChefHat className="w-6 h-6" />,
              image: "https://images.unsplash.com/photo-1576867757603-05b134ebc379?ixlib=rb-4.0.3",
              color: "from-pink-400 to-rose-500",
              features: ["Ready to use", "Track orders", "Manage menu"]
            }
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 
                         hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} 
                                 flex items-center justify-center text-white shadow-lg transform 
                                 group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="text-purple-200 text-sm">{item.description}</p>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative h-40 rounded-xl overflow-hidden mb-6"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform transition-transform 
                             duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-sm text-white 
                                px-3 py-1 rounded-full text-sm font-medium">
                    Step {item.step}
                  </div>
                </motion.div>

                <ul className="space-y-2">
                  {item.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="flex items-center gap-2 text-purple-100"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.color}`} />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-full
                     font-bold hover:bg-opacity-90 transition-all duration-300 hover:scale-105
                     shadow-lg hover:shadow-xl"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>

      <div className="py-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center text-white mb-16"
        >
          Benefits for Your Restaurant
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Smartphone className="w-8 h-8" />,
              title: "Contactless Ordering",
              description: "Safe and modern dining experience"
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Better Customer Experience",
              description: "Quick and easy menu access"
            },
            {
              icon: <ChefHat className="w-8 h-8" />,
              title: "Efficient Management",
              description: "Real-time menu updates"
            },
            {
              icon: <Sparkles className="w-8 h-8" />,
              title: "Increased Revenue",
              description: "Streamlined ordering process"
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center text-white">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
              <p className="text-purple-100">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center py-16"
      >
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Modernize Your Restaurant?
        </h2>
        <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
          Join thousands of restaurants already using our QR Menu system
        </p>
        <Link
          to="/register"
          className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-full
                   font-bold hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
        >
          Get Started Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </motion.div>
    </div>
  );
};