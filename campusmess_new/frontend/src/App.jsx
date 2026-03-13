import React from 'react';
import { ChevronDown, Facebook, Twitter, Instagram, Mail, Phone, MapPin} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route ,Link, BrowserRouter} from 'react-router-dom';
import Signup from "./pages/Signup";
import Home from './pages/Home';
import Login from './pages/Login';
import { Navbar } from './Navbar';
import Subscribe from './pages/Subscribe';
import AdminDashboard from './adminPages/adminDashboard';
import HostelDashboard from './adminPages/hostelPage';
import StudentDashboard from './pages/studentDashboard';

function App() {
  return (
    <div className="min-h-screen bg-white scroll-smooth">

      {/* <Navbar></Navbar> */}
  
      <Routes>
        <Route path='/'  element={<Home/>}/>
        <Route path='/Signup'  element={<Signup/>}/>
        <Route path='/Login'  element={<Login/>}/>
        <Route path='/Subscribe'  element={<Subscribe/>}/>
        <Route path='/admin/dashboard/:instituteId'  element={<AdminDashboard/>}/>
        <Route path='/admin/dashboard/:instituteId/hostel/:hostelId'  element={<HostelDashboard/>}/>
        <Route path='/student/dashboard/:scholarNo'  element={<StudentDashboard/>}/>
      </Routes>
    
    </div>
  );
}

export default App;