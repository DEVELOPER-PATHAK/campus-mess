import React from 'react';
import { ChevronDown, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route ,Link, BrowserRouter} from 'react-router-dom';



export  const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white font-sans">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
         // Using a high-quality Unsplash image of a dining hall/healthy food
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=2070&auto=format&fit=crop')" }}
      >
        {/* Dark overlay so text pops */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-6 max-w-4xl mx-auto mt-16">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg">
          Modernizing Your <br /> <span className="text-green-500">Campus Dining</span> Experience
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-gray-200 drop-shadow-md">
          Streamline booking, manage menus, and reduce waste with our smart mess management system.
        </p>
        <Link to="login">
        <button className="bg-green-600 hover:bg-green-700 text-white text-lg font-bold px-10 py-4 rounded-full transition transform hover:scale-105 shadow-xl shadow-green-900/30">
          Get Started
        </button>
        </Link>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2  z-10 animate-bounce text-white/80">
        <a href="#functionalities" className="flex flex-col items-center">
          <span className="text-sm mb-3.5 uppercase tracking-widest">Scroll Down</span>
          <ChevronDown size={32} />
        </a>
      </div>
    </section>
  );
};