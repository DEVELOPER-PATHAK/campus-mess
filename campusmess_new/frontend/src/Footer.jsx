import React from 'react';
import { ChevronDown, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route ,Link, BrowserRouter} from 'react-router-dom';
import Signup from "./pages/Signup";
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';

export const Footer = () => {
  return (
    <footer id="contact-footer" className="bg-gray-900 text-gray-300 py-16 font-sans">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
        {/* Column 1: Brand */}
        <div>
           <div className="text-2xl font-bold text-white mb-4">
            CampusMess<span className="text-green-500">.</span>
          </div>
          <p className="mb-6">Simplifying campus dining one meal at a time.</p>
        </div>

         {/* Column 2: Contact Us Details */}
        <div>
          <h3 className="text-white text-lg font-bold mb-6">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <Mail size={20} className="text-green-500" />
              <span>support@campusmess.com</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={20} className="text-green-500" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center space-x-3">
              <MapPin size={20} className="text-green-500" />
              <span>University Campus, Block C</span>
            </li>
          </ul>
        </div>

        {/* Column 3: Socials */}
        <div>
          <h3 className="text-white text-lg font-bold mb-6">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-green-600 hover:text-white transition"><Facebook size={20} /></a>
            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-green-600 hover:text-white transition"><Twitter size={20} /></a>
            <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-green-600 hover:text-white transition"><Instagram size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
        <p>© 2026 CampusMess Systems. All rights reserved.</p>
        {/* "Made by XYZ" requirement */}
        <p className="mt-2 text-gray-500">Made with ❤️ by <span className="text-gray-300 font-medium">XYZ Developers</span></p>
      </div>
    </footer>
  );
};