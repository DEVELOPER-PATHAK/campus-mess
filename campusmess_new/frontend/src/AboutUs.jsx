import React from 'react';
import { ChevronDown, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route ,Link, BrowserRouter} from 'react-router-dom';
import Signup from "./pages/Signup";
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';


export const AboutUs = () => {
  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-10">
        
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            About Our Mess Management System
          </h2>

          <p className="text-gray-600 leading-relaxed mb-4">
            We are dedicated to improving the quality of life for students and the efficiency of administration staff.
            Our mess management system was born out of a need to digitize outdated paper-based processes, ensure fair food
            distribution, and cut down on unnecessary food waste on campus.
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            By combining technology with smart planning, we help institutions save time, reduce costs, and create a
            better dining experience for everyone.
          </p>

          <button className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition">
            Learn More
          </button>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://media.istockphoto.com/id/1446478805/photo/a-chef-is-finishing-the-preparation-of-the-plate.jpg?s=612x612&w=0&k=20&c=OoFoYYJ0_eun72wlt-lDzlYjY-CaLwphDgUyIApDu_I="
            alt="Mess management"
            className="w-full max-w-md rounded-2xl shadow-lg object-cover"
          />
        </div>

      </div>
    </section>
  );
};