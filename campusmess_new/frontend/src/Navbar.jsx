import React from 'react';
import { ChevronDown, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route ,Link, BrowserRouter} from 'react-router-dom';
import Signup from "./pages/Signup";

export const Navbar = () => {
  return (
    // absolute position to sit on top of the hero image
    <header className="absolute top-0 left-0 w-full z-20 border-b border-white/10 bg-black/20 backdrop-blur-sm font-sans">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">
          CampusMess<span className="text-green-500">.</span>
        </div>

        {/* Navigation Items - Order specified in prompt */}
        <nav className="flex items-center space-x-8 text-white font-medium">
          <a href="#contact-footer" className="hover:text-green-400 transition">Contact Us</a>
          <a href="Subscribe" className="hover:text-green-400 transition">Subscribe</a>
          
          <div className="flex items-center space-x-4 ml-4">
            <Link to="/Login">
            <button className="px-4 py-2 text-sm hover:text-green-400 transition">
              Login 
            </button>
            </Link>
            {/* <a href="Signup"> */}
            <Link to="/signup">
            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition shadow-lg shadow-green-900/20">
              Signup
            </button>
            </Link>
            {/* </a> */}
          </div>
        </nav>
      </div>
    </header>
  );
};