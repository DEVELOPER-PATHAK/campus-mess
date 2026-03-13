
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Lock, Phone, FileBadge, CheckSquare, TextCursor } from 'lucide-react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Signup = () => {
     const navigate= useNavigate();

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const formData= new FormData(e.target);


    const payload = {
      instituteName: formData.get('instituteName'),
      instituteId: formData.get('instituteId'),
      contact: formData.get('contact'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      termsAccepted: formData.get('terms')
    };

    if (payload.password !== payload.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!payload.termsAccepted) {
      alert('Please accept terms and conditions');
      return;
    }

    try {
      const response= await axios.post('http://localhost:4000/api/admin/register',payload);
      console.log(response.data);
      if(response.data.success){
             alert("Institute registration successfully done");
      }

            navigate('/admin/dashboard')

    } catch (error) {
        console.error(error);
        // alert(error.response?.data)
        
    }


  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Institute Registration
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Register your institute on CampusMess.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-green-900/10 sm:rounded-xl sm:px-10 border border-gray-100">

          {/* --- INSTITUTE FORM --- */}
          <form  onSubmit={handleSubmit} className="space-y-5">
            
            {/* Institute Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Institute Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="instituteName"
                  placeholder="Institute of Technology"
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm py-2 border"
                />
              </div>
            </div>

            {/* Two Column Row */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Institute ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Institute ID</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileBadge className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                     name="instituteId"
                    placeholder="123456"
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm py-2 border"
                  />
                </div>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                     name="contact"
                    placeholder="9876543210"
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm py-2 border"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Official Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                   name="email"
                  placeholder="admin@institute.edu.in"
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm py-2 border"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                     name="password"
                    placeholder="••••••••"
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm py-2 border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CheckSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                     name="confirmPassword"
                    placeholder="••••••••"
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm py-2 border"
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                name="terms"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the <span className="text-green-600">Terms and Conditions</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Register Institute
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Log in instead
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;

