import React, { useState , useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const StudentDesktopDashboard = () => {
  // A single master state for the entire day
  const [isEatingToday, setIsEatingToday] = useState(true);

  const backendUrl= import.meta.env.VITE_BACKEND_URL

  const { scholarNo } = useParams();

  const temp={};

  const [student,setStudent]= useState(temp);

    const meal = [
    { 
      name: 'Breakfast', time: '7:30 AM - 9:30 AM', price: 0,
      menu:[],
      icon: <svg className="w-10 h-10 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
    },
    { 
      name: 'Lunch', time: '12:30 PM - 2:30 PM', price: 0,
      menu: [], 
      icon: <svg className="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
    },
    { 
      name: 'Dinner', time: '7:30 PM - 9:30 PM', price: 0,
      menu: [], 
      icon: <svg className="w-10 h-10 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
    }
  ];

  const [meals,setMeal] = useState(meal);


  
useEffect(() => {
  const fetchData = async () => {
    try {
      // const response = await axios.get("/api/getHostels");
      const payload= {
         scholarNo:scholarNo
      };
       const response =   await axios.post(
       backendUrl+  `/api/student/fetchStudentDetails`, payload
    );

  const studentData = {
    instituteId: response.data.student.instituteId,
    status: response.data.student.status,
    name: response.data.student.name,
    scholarNo: response.data.student.scholarNo,
    hostel: response.data.student.hostelNo,
   // branch: "Electrical Engineering",
    // role: "Class Representative",
    baseSavedAmount: response.data.student.saved,
    fine: response.data.student.fine,
    qrImage: response.data.student.qrCode
  }
  setStudent(studentData)

  if(studentData.status == "Eating"){
       setIsEatingToday(1);
  }
  else{
        setIsEatingToday(0);
  }


  const payload2= {
    hostelNo:studentData.hostel,
    instituteId:studentData.instituteId
  };

     const response2 =   await axios.post(
      backendUrl+ `/api/student/fetchMenuDetails`, payload2
    );


    if(response2.data.success){
          meal[0].menu.push(response2.data.menu.breakfast)
          meal[1].menu.push(response2.data.menu.lunch)
          meal[2].menu.push(response2.data.menu.dinner)
          meal[0].price=(Math.round(Number(response2.data.menu.price )/3))
          meal[1].price=(Math.round(Number(response2.data.menu.price )/3))
          meal[2].price= (Math.round(Number(response2.data.menu.price )/3))
    }

    setMeal(meal);

   
   
    } catch (error) {
      console.log(error);
    }
  };

  fetchData();
}, []);


;

const handleStatusChange =  async (data)=>{

  let status="Eating";
   if(!data){
      status="notEating" 
   }

   const payload={
      scholarNo:scholarNo,
      status:status,
      price: meals[0].price * 3
   }

   console.log(payload);
   
try {  
     const response =   await axios.post(
        backendUrl+  `/api/student/updateStatus`, payload
      );
     
      console.log(response);
      if(response.data.success){
        alert("status changed successfully")
      }
} catch (error) {
       console.log(error);
}

}
const toggleEatingStatus = () => {
  const newValue = !isEatingToday;
  setIsEatingToday(newValue);
  handleStatusChange(newValue);
};



  // Static menu data (no individual toggles)



  // Calculations
  const dailyCost = meals.reduce((acc, curr) => acc + curr.price, 0); // 190
  const totalSaved = isEatingToday ? Number(student.baseSavedAmount) : Number(student.baseSavedAmount );

  return (
    // h-screen ensures it locks to the laptop's viewport height, preventing unnecessary scrolling
    <div className="h-screen w-full bg-slate-50 font-sans text-slate-800 p-6 flex justify-center items-center overflow-hidden">
      
      <div className="w-full max-w-[1600px] h-full flex gap-6">
        
        {/* ================= LEFT SIDEBAR (IDENTITY & WALLET) ================= */}
        <div className="w-[30%] flex flex-col gap-6 h-full">
          
          {/* Identity Card - Fills available vertical space beautifully */}
          <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-800 rounded-3xl p-8 relative overflow-hidden shadow-xl flex-grow flex flex-col justify-between items-center text-center">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            
            <div className="w-full relative z-10 flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-8">
                {/* <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase text-white border border-white/20">
                  {studentData.role}
                </span> */}
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase text-white border border-white/20">
              Hostel {student.hostel}
                </span>
              </div>
              
              <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">{student.name}</h1>
              <p className="font-mono text-indigo-200 text-xl mb-6 tracking-widest">{student.scholarNo}</p>
              {/* <p className="text-indigo-100 font-medium mb-10">{studentData.branch}</p> */}

              {/* Massive QR Code Block */}
              <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl w-full max-w-[260px] aspect-square flex flex-col items-center justify-center gap-5 group transition-transform hover:scale-105 duration-300">
                <img src={student.qrImage} alt="QR Code" className="w-40 h-40 object-contain" />
                <a 
                  href={student.qrImage} 
                  download={`QR_${student.scholarNo}.png`}
                  className="bg-slate-100 hover:bg-indigo-50 text-indigo-600 text-sm font-bold py-3 px-8 rounded-full transition-colors w-full text-center"
                >
                  Download Qr Code
                </a>
              </div>
            </div>
          </div>

          {/* Financial Widgets Row */}
          <div className="flex gap-4 h-[160px] flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex-1 flex flex-col justify-center relative overflow-hidden group">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wide mb-2">Total Saved</p>
              <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-3xl font-bold text-slate-800">₹</span>
                <span className="text-5xl font-black text-emerald-500 tracking-tighter transition-all duration-500">{totalSaved}</span>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
                 <svg className="w-32 h-32 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex-1 flex flex-col justify-center relative overflow-hidden group">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wide mb-2">Fines Due</p>
              <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-3xl font-bold text-slate-800">₹</span>
                <span className="text-5xl font-black text-rose-500 tracking-tighter">{student.fine}</span>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
                <svg className="w-32 h-32 text-rose-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
          </div>

        </div>

        {/* ================= RIGHT MAIN AREA (MASTER CONTROL & MENU) ================= */}
        <div className="w-[70%] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 p-10 flex flex-col h-full relative overflow-hidden">
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

          {/* Master Control Header */}
          <div className="relative z-10 flex justify-between items-center bg-slate-50 border border-slate-200 p-8 rounded-[2rem] mb-8">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-800 mb-2">Daily Mess Pass</h2>
              <p className="text-slate-500 font-medium text-lg">
                {isEatingToday ? 'You are scheduled to eat all meals today.' : `You have opted out. ₹${dailyCost} added to your savings.`}
              </p>
            </div>
            
            {/* The Master Toggle Button */}
            <div className="flex items-center gap-4">
              <span className={`text-lg font-bold transition-colors duration-300 ${!isEatingToday ? 'text-slate-400' : 'text-emerald-600'}`}>
                {isEatingToday ? 'ACTIVE' : 'INACTIVE'}
              </span>
              <button 
          onClick={toggleEatingStatus}
                
                className={`relative inline-flex h-14 w-24 flex-shrink-0 cursor-pointer rounded-full border-4 border-transparent transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/30 shadow-inner ${isEatingToday ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <span className={`pointer-events-none relative inline-block h-12 w-12 transform rounded-full bg-white shadow-md transition duration-300 ${isEatingToday ? 'translate-x-10' : 'translate-x-0'}`}>
                   <span className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-300 ${isEatingToday ? 'opacity-100' : 'opacity-0'}`}>
                      <svg className="h-6 w-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                   </span>
                   <span className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-300 ${isEatingToday ? 'opacity-0' : 'opacity-100'}`}>
                     <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                   </span>
                </span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md border border-gray-200">
  
  <h2 className="text-lg font-semibold text-gray-700 mb-2">
    Total Meal Price
  </h2>
  
  <p className="text-3xl font-bold text-green-600">
    {meals[0].price * 3}
  </p>

</div>

          {/* 3-Column Informational Grid for Meals */}
          <div className="relative z-10 grid grid-cols-3 gap-6 flex-grow">
            {meals.map((meal, index) => (
              <div 
                key={index} 
                className={`relative flex flex-col rounded-[2rem] border-2 transition-all duration-500 p-8 ${
                  isEatingToday 
                    ? 'bg-white border-slate-100 shadow-lg hover:border-indigo-200' 
                    : 'bg-slate-50 border-slate-200 opacity-60 grayscale-[0.6] scale-[0.98]'
                }`}
              >
                {/* Header: Icon & Price */}
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-4 rounded-2xl ${isEatingToday ? 'bg-slate-50 shadow-sm' : 'bg-slate-200'}`}>
                    {meal.icon}
                  </div>
                  <span className={`text-base font-bold px-4 py-1.5 rounded-full ${isEatingToday ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                    ₹{meal.price}
                  </span>
                </div>

                {/* Body: Title & Time */}
                <div className="mb-6 flex-grow">
                  <h3 className={`text-3xl font-extrabold mb-2 ${isEatingToday ? 'text-slate-800' : 'text-slate-500 line-through decoration-slate-400'}`}>
                    {meal.name}
                  </h3>
                  <p className="text-base font-semibold text-slate-400 mb-8">{meal.time}</p>
                  
                  {/* Menu Items */}
                  <ul className="space-y-4">
                    {meal.menu.map((item, idx) => (
                      <li key={idx} className={`text-base font-semibold flex items-center gap-3 ${isEatingToday ? 'text-slate-600' : 'text-slate-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${isEatingToday ? 'bg-indigo-400' : 'bg-slate-300'}`}></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDesktopDashboard;