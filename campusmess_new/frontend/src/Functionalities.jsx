import React from 'react';
import { ChevronDown, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route ,Link, BrowserRouter} from 'react-router-dom';

export const Functionalities = () => {
  return (
    <section id="functionalities" className="py-24 bg-gray-50 font-sans">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Core Functionalities</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {/* Feature Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6 text-2xl">📅</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Reduces Food Wastage</h3>
            <p className="text-gray-600">Students can cancel meals in seconds via the dashboard.</p>
          </div>
          {/* Feature Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
           <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6 text-2xl">🥗</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Efficient Food and Labour Management</h3>
            <p className="text-gray-600">Admins can manage menu and their dynamic pricing.</p>
          </div>
          {/* Feature Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
           <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6 text-2xl">💳</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Track Payments</h3>
            <p className="text-gray-600">Transparent billing history and easy wallet recharges.</p>
          </div>
        </div>
      </div>
    </section>
  );
};