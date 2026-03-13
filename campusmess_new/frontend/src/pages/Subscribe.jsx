import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Users, Shield, Zap, ArrowRight } from 'lucide-react';

const Subscribe = () => {
  // Plan Configuration
  const plans = [
    {
      id: 1,
      students: 100,
      price: 99,
      features: ['Basic Menu Planning', 'Student Attendance', 'Email Support'],
      recommended: false,
      color: 'bg-gray-50'
    },
    {
      id: 2,
      students: 500,
      price: 199,
      features: ['Advanced Menu Planning', 'Inventory Tracking', 'Priority Email Support', 'Wastage Reports'],
      recommended: true, // Highlights this card
      color: 'bg-green-50'
    },
    {
      id: 3,
      students: 1000,
      price: 299,
      features: ['All Inventory Features', 'Payment Gateway', '24/7 Chat Support', 'Detailed Analytics'],
      recommended: false,
      color: 'bg-gray-50'
    },
    {
      id: 4,
      students: 10000,
      price: 999,
      features: ['Unlimited Admin Accounts', 'Custom Branding', 'Dedicated Account Manager', 'API Access'],
      recommended: false,
      color: 'bg-gray-50'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Header / Hero */}
      <div className="bg-gray-900 pt-20 pb-24 px-6 text-center">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
          Choose a plan that fits the size of your campus. All plans include yearly access to the Mess Management System.
        </p>
      </div>

      {/* Pricing Cards Container */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative flex flex-col p-6 rounded-2xl shadow-xl border ${plan.recommended ? 'border-green-500 transform scale-105 z-10' : 'border-gray-200'} bg-white transition-transform hover:scale-105 duration-300`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                  Most Popular
                </div>
              )}

              {/* Plan Title */}
              <div className="mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100 text-green-600 mb-4">
                  <Users size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-500 uppercase tracking-wide">Capacity</h3>
                <p className="text-2xl font-bold text-gray-900">Up to {plan.students.toLocaleString()} Students</p>
              </div>

              {/* Price */}
              <div className="mb-6 border-b border-gray-100 pb-6">
                <span className="text-4xl font-extrabold text-gray-900">₹{plan.price}</span>
                <span className="text-gray-500 text-lg">/year</span>
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <button className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-colors shadow-sm ${plan.recommended ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>

        {/* Not Registered Section */}
        <div className="mt-16 bg-green-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between border border-green-100">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Not registered with us yet?</h2>
            <p className="text-gray-600 max-w-lg">
              To purchase a subscription, you first need to create an Institute account. Setup takes less than 2 minutes.
            </p>
          </div>
          <Link to="/signup">
            <button className="flex items-center bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl">
              Create Account <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Subscribe;