import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";


import axios from 'axios';
import {
  Users,
  Utensils,
  UserPlus,
  UserMinus,
  ChevronRight,
  Edit3,
  DollarSign,
  List,
  X
} from 'lucide-react';

// --- Mock Data ---
const MOCK_MENU = {
  breakfast: "",
  lunch: "",
  dinner: "",
  price: ""
};

const MOCK_STATS = {
  totalStudents: 0,
  eatingToday: 0,
  notEatingToday: 0
};

// --- Sub-Components for Professional Modularity ---

const StatCard = ({ label, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${colorClass}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const ActionButton = ({ icon: Icon, label, onClick, variant = 'primary' }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]}`}>
      <Icon size={18} />
      {label}
    </button>
  );
};

// --- Main Dashboard Component ---

const HostelDashboard = () => {
  // State Management
  const [menu, setMenu] = useState(MOCK_MENU);
  const [mealPrice, setMealPrice] = useState(120); // Dynamic Pricing State
  const [viewState, setViewState] = useState('dashboard');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [scanning, setScanning] = useState(false);

  const [eat,setEat]= useState(0);

  const [isUpdateMenuOpen, setIsUpdateMenuOpen] = useState(false);

  const temp = [];
  const [students, setStudents] = useState(temp);


  const { instituteId, hostelId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get("/api/getHostels");
        const response = await axios.get(
          `http://localhost:4000/api/admin/fetchStudents/${instituteId}/${hostelId}`
        );
        const menuresponse = await axios.get(
          `http://localhost:4000/api/admin/fetchMenu/${instituteId}/${hostelId}`
        );

        // const list =response.data

        const formattedStudents = response.data.students.map(h => (
          {     
          id: h._id,
          name: h.name,
          scholarNo: h.scholarNo,
          email: h.email,
          password: h.password,
          status: h.status
           
        }));

       let val=0;

       response.data.students.forEach(h => {
     if (h.status === 'Eating'){
        val+=1;    
     }
    //  else if (h.status === 'notEating') MOCK.notEatingToday+=1;
    //  MOCK.totalStudents+=1;    
     });

       setEat(val);

     //  setMOCK_STATS(MOCK);


        setStudents(formattedStudents);

        if (!menuresponse.data.success) {
          console.log("create the menu")
        }
        else {
          const newMenu = {
            breakfast: menuresponse.data.menu.breakfast,
            lunch: menuresponse.data.menu.lunch,
            dinner: menuresponse.data.menu.dinner,
            price: menuresponse.data.menu.price,
          }

          setMenu(newMenu);

        }

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);


  function generatePassword() {
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += Math.floor(Math.random() * 10); // digits 0–9
    }
    return password;
  }

  const handleAddStudent = async (newStudent) => {

    const pswd = generatePassword();

    const payload = {
      name: newStudent.name,
      scholarNo: newStudent.scholarNo,
      email: newStudent.email,
      password: pswd
    };
    try {

      const response = await axios.post(
        `http://localhost:4000/api/admin/addStudent/${instituteId}/${hostelId}`,
        payload
      );

      if (response.data.success) {
        alert("student added successfully")

        const saved = response.data.student;

      //  <img src={saved.qrCode} alt="student qr code" />


        setStudents([
          ...students,
          {
            id: saved._id, // backend id
            name: saved.name,
            scholarNo: saved.scholarNo,
            status: saved.status,
            email: saved.email,
            password: saved.password

          }
        ]);





        const emailresponse =
          await axios.post("http://localhost:4000/api/admin/sendEmail", {
            name: saved.name,
            email: saved.email,
            password: saved.password,
            qr:saved.qrCode
          });

        if (emailresponse.data.success) {
          alert("email sent successfully");
        }


      }
    } catch (error) {

      console.log(error);
    }

  }
 


  const verification = async (scholarNo)=>{
     const payload= {
      scholarNo:scholarNo,
      price:menu.price
     };

      const response = await axios.post(
          `http://localhost:4000/api/admin/verifyStudent`,
          payload
        );


      alert(response.data.message);


  }

  const startScanner = () => {

    const html5QrCode = new Html5Qrcode("reader");

    setScanner(html5QrCode);

    html5QrCode.start(
      { facingMode: "environment" }, // use back camera
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      (decodedText) => {
        console.log("QR Code Data:", decodedText);
      alert("Scanned: " + decodedText);
           verification(decodedText);
        stopScanner();
      
      },
      (errorMessage) => {
        // ignore scan errors
      }
    );
    setScanning(true);
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.stop().then(() => {
        scanner.clear();
        setScanning(false);
      });
    }
  };



  const handleUpdateMenu = async (menu) => {
    const payload = {
      breakfast: menu.breakfast,
      lunch: menu.lunch,
      dinner: menu.dinner,
      price: menu.price
    };

    try {

      const response = await axios.post(
        `http://localhost:4000/api/admin/updateMenu/${instituteId}/${hostelId}`,
        payload
      );

      if (response.data.success) {
        alert("menu updated successfully");
        setMenu(payload)
      }


    } catch (error) {
      console.log(error);
    }


  }



  const handleDeleteStudent = async (id) => {

    if (window.confirm("Are you sure you want to delete this hostel? This action cannot be undone.")) {

      try {
        const payload = { id: id };

        const response = await axios.post(
          `http://localhost:4000/api/admin/removeStudent/${instituteId}/${hostelId}`,
          payload
        );

        if (response.data.success) {
          setStudents(students.filter(student => student.id !== id));
          alert(" student deleted successfully")

        }
      } catch (error) {
        console.log(error);
      }

    }
  };


  const renderDashboard = () => (
    
    <div className="space-y-8">

      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Students"
          value={students.length}
          icon={Users}
          colorClass="bg-blue-500"
        />
        <StatCard
          label="Opted for Meal"
          value={eat}
          icon={Utensils}
          colorClass="bg-green-500"
        />
        <StatCard
          label="Skipping Meal"
          value={students.length - eat}
          icon={UserMinus}
          colorClass="bg-orange-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Upcoming Meal & Pricing */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Meal Operations</h2>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
              Dinner
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Dynamic Pricing Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 font-medium">Dynamic Meal Price</span>
                <Edit3 size={16} className="text-gray-400 cursor-pointer hover:text-blue-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg text-gray-500 font-medium">₹</span>
                <span className="text-4xl font-bold text-gray-900">{menu.price}</span>
                <span className="text-sm text-gray-400">/ per head</span>
              </div>
            </div>

            {/* Attendance Split Actions */}
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setViewState('eating_list')}
                className="cursor-pointer group hover:bg-blue-50 p-4 rounded-lg border border-blue-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-600 font-semibold mb-1">Eating</p>
                    <p className="text-2xl font-bold text-gray-800">{eat}</p>
                  </div>
                  <ChevronRight size={20} className="text-blue-300 group-hover:text-blue-500" />
                </div>
                <p className="text-xs text-gray-500 mt-2">View List</p>
              </div>

              <div
                onClick={() => setViewState('not_eating_list')}
                className="cursor-pointer group hover:bg-orange-50 p-4 rounded-lg border border-orange-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-orange-600 font-semibold mb-1">Not Eating</p>
                    <p className="text-2xl font-bold text-gray-800">{students.length - eat}</p>
                  </div>
                  <ChevronRight size={20} className="text-orange-300 group-hover:text-orange-500" />
                </div>
                <p className="text-xs text-gray-500 mt-2">View List</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Menu & Student Admin */}
        <div className="space-y-6">
          {/* Menu Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Today's Menu</h2>
              <button onClick={() => { setIsUpdateMenuOpen(true) }} className="text-blue-600 text-sm font-medium hover:underline">Update Menu</button>
            </div>
            <div className="space-y-3">
              {Object.entries(menu).map(([meal, items]) => (
                <div key={meal} className="flex gap-4 items-start pb-3 border-b border-gray-50 last:border-0">
                  <span className="w-20 text-xs font-bold uppercase text-gray-400 mt-1">{meal}</span>
                  <p className="text-gray-700 font-medium flex-1">{items}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Student Admin Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Student Administration</h2>
            <div className="flex flex-wrap gap-3">
              <ActionButton
                icon={UserPlus}
                label="Add Student"
                variant="primary"
                onClick={() => {
                  setIsAddStudentOpen(true);
                }}
              />
              <ActionButton
                icon={List}
                label="See All Students"
                variant="secondary"
                onClick={() => setViewState('all_students')}
              />
            </div>
          </div>


        </div>
      </div>
    </div>
  );

  // 2. The Detailed List View (Reusable for All/Eating/Not Eating)
  const renderListView = (title, type) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center gap-4">
        <button
          onClick={() => setViewState('dashboard')}
          className="text-gray-500 hover:text-gray-800"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      <div className="p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-100">
              <th className="pb-3 font-medium">Student Name</th>
              <th className="pb-3 font-medium">Scholar No</th>
              <th className="pb-3 font-medium">Status</th>
              {type === 'all' && <th className="pb-3 font-medium text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">

            {/* { students.map((item,index)=>(   
            //can try to use index if we get problem later...  
                  
           <tr className="group hover:bg-gray-50 transition-colors">
              <td className="py-4 font-medium text-gray-700">{item.name}</td>
              <td className="py-4 text-gray-500">{item.scholarNo}</td>
              <td className="py-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
                  {item.status}
                </span>
              </td>
              {type === 'all' && (
                <td   onClick={()=> handleDeleteStudent(item.id)} className="py-4 text-right text-red-500 cursor-pointer text-sm font-medium">Remove</td>
              )}
            </tr>

              ))} */}

            {/* {students.map((item, index) =>  {   if(type == eating && item.status != eating) return; }  (   
             
              <tr

                key={index}
                className="group hover:bg-gray-50 transition-colors"
                 
              >
             
              <td className="py-4 font-medium text-gray-700">{item.name}</td> 
                <td className="py-4 text-gray-500">{item.scholarNo}</td> 
                <td className="py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
                    {item.status}
                  </span>
                </td>



                {type === 'all' && (
                  <td
                    onClick={() => handleDeleteStudent(item.id)}
                    className="py-4 text-right text-red-500 cursor-pointer text-sm font-medium"
                  >
                    Remove
                  </td>
                )}

                
              </tr>
            ))} */}
            {students.map((item, index) => {
        if (type === 'eating' && item.status !== 'Eating') return ;
        if (type === 'noteating' && item.status !== 'notEating') return ;

  return (
    <tr
      key={index}
      className="group hover:bg-gray-50 transition-colors"
    >
      <td className="py-4 font-medium text-gray-700">{item.name}</td> 
      <td className="py-4 text-gray-500">{item.scholarNo}</td> 
      <td className="py-4">
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
          {item.status}
        </span>
      </td>

      {type === 'all' && (
        <td
          onClick={() => handleDeleteStudent(item.id)}
          className="py-4 text-right text-red-500 cursor-pointer text-sm font-medium"
        >
          Remove
        </td>
      )}
    </tr>
  );
})}


          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
{/* 
 <div style={{ textAlign: "center" }}>

      <h2>QR Code Scanner</h2>

      <button onClick={startScanner}>
        Open Camera
      </button>

      {scanning && (
        <button onClick={stopScanner}>
          Stop Camera
        </button>
      )}

      <div
        id="reader"
        style={{ width: "300px", margin: "auto", marginTop: "20px" }}
      ></div>

    </div> */}

<div style={{ textAlign: "center", padding: "24px", backgroundColor: "#f8f9fa", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", maxWidth: "400px", margin: "20px auto", fontFamily: "sans-serif" }}>

  <h2 style={{ color: "#212529", marginBottom: "20px", fontSize: "1.5rem" }}>QR Code Scanner</h2>

  <button 
    onClick={startScanner}
    style={{ padding: "10px 24px", margin: "0 8px", backgroundColor: "#0d6efd", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", fontWeight: "500" }}
  >
    Open Camera
  </button>

  {scanning && (
    <button 
      onClick={stopScanner}
      style={{ padding: "10px 24px", margin: "0 8px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", fontWeight: "500" }}
    >
      Stop Camera
    </button>
  )}

  <div
    id="reader"
    style={{ 
      width: "300px", 
      margin: "auto", 
      marginTop: "24px", 
      border: "2px dashed #dee2e6", 
      borderRadius: "8px", 
      backgroundColor: "#ffffff", 
      minHeight: "300px", 
      display: scanning ? "flex" : "none", /* This hides the box when not scanning */
      alignItems: "center", 
      justifyContent: "center" 
    }}
  ></div>

</div>
    
    
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hostel Manager</h1>
          <p className="text-gray-500 mt-1">Mess Management System & Dashboard</p>
        </div>
        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
          HM
        </div>
      </header>

      <main>
        {viewState === 'dashboard' && renderDashboard()}
        {viewState === 'eating_list' && renderListView('Students Eating Today', 'eating')}
        {viewState === 'not_eating_list' && renderListView('Students Not Eating', 'noteating')}
        {viewState === 'all_students' && renderListView('All Registered Students', 'all')}


        {isAddStudentOpen && (
          <AddStudentModal
            isOpen={isAddStudentOpen}
            onClose={() => setIsAddStudentOpen(false)}
            onSubmit={handleAddStudent}
          />
        )}
        {isUpdateMenuOpen && (
          <UpdateMenuModal
            isOpen={isUpdateMenuOpen}
            onClose={() => setIsUpdateMenuOpen(false)}
            onSubmit={handleUpdateMenu}
          />
        )}
      </main>
    </div>
    </div>
    
  );
};







const AddStudentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    scholarNo: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.scholarNo && formData.email) {
      onSubmit(formData);
      // Optional: Reset form after submit
      setFormData({ name: '', scholarNo: '', email: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Add New Student</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
            <input
              type="text"
              name="studentName"
              placeholder="e.g. John Doe"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Scholar No Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scholar No</label>
            <input
              type="text"
              name="scholarNo"
              placeholder="e.g. 2024-CS-101"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              value={formData.scholarNo}
              onChange={(e) => setFormData({ ...formData, scholarNo: e.target.value })}
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. student@university.edu"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 rounded-lg transition-colors shadow-lg shadow-gray-900/10"
            >
              Add Student
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

const UpdateMenuModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
    price: ''
  });

  // Populate form with existing data when the modal opens
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        breakfast: initialData.breakfast || '',
        lunch: initialData.lunch || '',
        dinner: initialData.dinner || '',
        price: initialData.price || ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.breakfast && formData.lunch && formData.dinner && formData.price) {
      onSubmit(formData);
      // Optional: Reset form after submit if you aren't immediately closing it
      setFormData({ breakfast: '', lunch: '', dinner: '', price: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Update Menu</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Breakfast Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Breakfast</label>
            <input
              type="text"
              name="breakfast"
              placeholder="e.g. Pancakes and Coffee"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              value={formData.breakfast}
              onChange={(e) => setFormData({ ...formData, breakfast: e.target.value })}
              required
            />
          </div>

          {/* Lunch Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lunch</label>
            <input
              type="text"
              name="lunch"
              placeholder="e.g. Grilled Chicken Sandwich"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              value={formData.lunch}
              onChange={(e) => setFormData({ ...formData, lunch: e.target.value })}
              required
            />
          </div>

          {/* Dinner Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dinner</label>
            <input
              type="text"
              name="dinner"
              placeholder="e.g. Spaghetti Bolognese"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              value={formData.dinner}
              onChange={(e) => setFormData({ ...formData, dinner: e.target.value })}
              required
            />
          </div>

          {/* Price Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="text"
              name="price"
              placeholder="e.g. $15.00"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 rounded-lg transition-colors shadow-lg shadow-gray-900/10"
            >
              Update Menu
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};



export default HostelDashboard;