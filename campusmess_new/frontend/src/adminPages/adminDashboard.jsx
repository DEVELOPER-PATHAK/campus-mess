
import React, { useState  } from 'react';
import { Link } from 'react-router-dom';
import { useParams , useNavigate } from "react-router-dom";
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Home, 
  Users, 
  TrendingUp, 
  Search, 
  Crown, 
  X, 
  Check, 
  Trash2, 
  AlertCircle ,
  CreditCard
} from 'lucide-react';
import { useEffect } from 'react';


// --- Mock Data ---
// Note: Hostels no longer have a 'capacity' limit. 
// The limit is now enforced by the Institute Plan.
const initialHostels = [
//   { id: 1, name: "Block A - Boys Hostel", students: 180, lastUpdated: "2h ago" },
//   { id: 2, name: "Block B - Girls Hostel", students: 120, lastUpdated: "1d ago" },
//   { id: 3, name: "Block C - Freshers", students: 45, lastUpdated: "5h ago" },
];


  //
// Plans now define the Maximum Student Capacity for the entire institute
const availablePlans = [
  { name: "Basic Mess", maxStudents: 500, price: "₹2500/mo", features: "Breakfast + Dinner" },
  { name: "Standard Mess", maxStudents: 1000, price: "₹3500/mo", features: "3 Meals + Tea" },
  { name: "Premium Mess", maxStudents: 2000, price: "₹5000/mo", features: "3 Meals + Snacks + Non-Veg" },
];

const AdminDashboard = () => {

  // Global Stat

  const backendUrl= import.meta.env.VITE_BACKEND_URL

  const [institutePlan, setInstitutePlan] = useState(0);
  const [currentIntake, setcurrentIntake] = useState(0);
  const [hostels, setHostels] = useState(initialHostels);
   const { instituteId } = useParams();

   const [paymentStatus, setPaymentStatus]= useState(null);
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // --- Calculations ---
  
  // 1. Get current plan details
  const currentPlanDetails = availablePlans.find(p => p.name === institutePlan) || availablePlans[1];
  
  // 2. Calculate Total Current Intake (Summation of all hostel students)
  const totalCurrentStudents = hostels.reduce((acc, curr) => acc + parseInt(curr.students || 0), 0);
  
  // 3. Calculate Global Occupancy Rate (Total Students / Plan Capacity)
 const planCapacity = currentPlanDetails.maxStudents;
  const occupancyPercentage = Math.round((totalCurrentStudents / planCapacity) * 100);

 

useEffect(() => {
  const fetchData = async () => {
    try {
      // const response = await axios.get("/api/getHostels");
       const response =   await axios.get(
       backendUrl+ `/api/admin/fetchHostel/${instituteId}`
    );

    // const list =response.data

    const formattedHostels = response.data.listHostels.map(h => ({
  id: h._id,
  name: h.hostelName,
  students: h.studentIntake,
  lastUpdated: "JustNow",
  no:h.hostelNo

}));

    const capa = response.data.inst.studentLimit;
    const limi = response.data.inst.currentIntake;
    console.log(capa);
    setInstitutePlan(capa);
    setcurrentIntake(limi)
   
      setHostels(formattedHostels);
    } catch (error) {
      console.log(error);
    }
  };

  fetchData();
}, []);





const handleAddHostel = async (newHostel) => {
  
  const payload = {
    hostelName: newHostel.name,
    hostelNo: newHostel.no,
  };

  try {
    console.log("Institute ID:", instituteId);
    console.log("Payload:", payload);

    const response = await axios.post(
       backendUrl+  `/api/admin/addHostel/${instituteId}`,
      payload
    );

    console.log("AddHostel response:", response.data);

    if (response.data && response.data.success) {
      alert("Hostel added successfully");

      // Use backend data so UI stays consistent with DB
      const saved = response.data.hostel;

      setHostels([
        ...hostels,
        {
          id: saved._id, // backend id
          name: saved.hostelName,
          no: saved.hostelNo,
          students: 0,
          lastUpdated: "Just now"
        }
      ]);



      setIsAddModalOpen(false);
    } else {
      // show server message if any
      const msg = (response.data && response.data.message) || "Failed to add hostel";
      alert(msg);
    }
  } catch (error) {
    console.error("Add hostel error:", error);
    alert("Error adding hostel. Check console / network tab.");
  }
};





  const handleDeleteHostel =  async(id) => {
      
    if (window.confirm("Are you sure you want to delete this hostel? This action cannot be undone.")) {
           
       try {
        const payload = { id:id};
 
           const response = await axios.post(

            backendUrl+
       `/api/admin/removeHostel/${instituteId}`,
       payload
     );
 
     if(response.data.success){
         setHostels(hostels.filter(hostel => hostel.id !== id));
       alert("hostel deleted successfully")
          
 
     }
       } catch (error) {
          console.log(error);
       }

    }
  };


  let  pay=0;





  // const handlePayment = async (amt) => {
  //   const { data } = await axios.post(
  //     "http://localhost:4000/api/admin/create-order",
  //     { amount: amt } // ₹500
  //   );

  //   const options = {
  //     key:  "rzp_test_EthSrvsZ4afFRy",
  //     amount: data.order.amount,
  //     currency: "INR",
  //     name: "CampusMess",
  //     description: "Test Transaction",
  //     order_id: data.order.id,

  //     handler: async function (response) {
  //       const verifyRes = await axios.post(
  //         "http://localhost:4000/api/admin/verify-payment",
  //         response
  //       );

  //       if (verifyRes.data.success) {
  //         alert("Payment Successful ✅");
  //         pay=1;
  //         setPaymentStatus(1);
  //         return 1;
  //       } else {
  //         alert("Payment Failed ❌");
  //         setPaymentStatus(0);
  //         return 0;
  //       }
  //     },

  //     prefill: {
  //       name: "Test User",
  //       email: "test@example.com",
  //       contact: "9999999999",
  //     },

  //     theme: {
  //       color: "#3399cc",
  //     },
  //   };

  //   const razor = new window.Razorpay(options);
  //   razor.open();
  // };

const handlePayment = async (amt) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.post(
         backendUrl+"/api/admin/create-order",
        { amount: amt }
      );

      const options = {
        key: "rzp_test_EthSrvsZ4afFRy",
        amount: data.order.amount,
        currency: "INR",
        name: "CampusMess",
        description: "Test Transaction",
        order_id: data.order.id,

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
            backendUrl+  "/api/admin/verify-payment",
              response
            );

            if (verifyRes.data.success) {
              alert("Payment Successful ✅");
              setPaymentStatus(1);
              resolve(1); // ✅ RETURN HERE
            } else {
              alert("Payment Failed ❌");
              setPaymentStatus(0);
              resolve(0);
            }
          } catch (err) {
            resolve(0);
          }
        },
      };

      const razor = new window.Razorpay(options);

      razor.on("payment.failed", function () {
        alert("Payment Failed ❌");
        setPaymentStatus(0);
        resolve(0); // ✅ handle failure event
      });

      razor.open();

    } catch (err) {
      reject(err);
    }
  });
};

  const updateCapacityHandler = async (cap)=>{
    try {

        const payload= {
          capacity: cap
        }
          const response = await axios.post(
      backendUrl+  `/api/admin/updateCapacity/${instituteId}`,
      payload
    );
     

    if(response.data.success){
          setInstitutePlan(response.data.admin.studentLimit)
    }


    } catch (error) {
      
    }
  }


  const handleGlobalUpgrade = async (newPlan) => {
  const val = institutePlan + newPlan;

  const res = await handlePayment(newPlan * 2);

 //  console.log("printing res", res); // ✅ now 1 or 0

  if (res === 1) {
    await updateCapacityHandler(val);
    setInstitutePlan(val);
  }

  setIsUpgradeModalOpen(false);
};
 const navigate= useNavigate();

  // const handleGlobalUpgrade = async (newPlan) => {
  //   const val= institutePlan + newPlan;
  //   const res=   await  handlePayment(newPlan *2 );

  //   console.log("prnting res");
  //   console.log(res);
    
  //   if(res){
  //      updateCapacityHandler(val);
  //      setInstitutePlan(val);
  //   }
    
  //   setIsUpgradeModalOpen(false);
  // };

  return (
   
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* --- Top Navigation & Global Plan Management --- */}

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-green-600 text-white p-1.5 rounded-lg">
                <Home size={20} />
              </div>
              <div onClick={() => navigate('/')}>
                 <span  className="text-xl font-bold text-gray-900">CampusMess Admin</span>
              </div>
             
            </div>

            {/* Right Side: Global Plan & Profile */}
            <div className="flex items-center gap-4">
              {/* Institute Plan Display */}
              <div className="hidden md:flex items-center gap-3 bg-green-50 px-4 py-1.5 rounded-full border border-green-100">
                <div className="flex items-center gap-2 text-green-800 text-sm font-semibold">
                  <Crown size={16} />
                  <span>{institutePlan}</span>
                  <span className="text-xs bg-green-200 text-green-900 px-1.5 py-0.5 rounded ml-1">
                    Max: {planCapacity}
                  </span>
                </div>
                <button 
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="text-xs bg-white text-green-700 border border-green-200 px-2 py-0.5 rounded hover:bg-green-50 transition-colors"
                >
                  Upgrade
                </button>
              </div>

              <div className="h-8 w-8 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold text-sm">
                AD
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Statistics Section (Based on Plan Capacity) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Plan Capacity (Max Limit)" 
            value={institutePlan} 
            subtitle="Based on purchased plan"
            icon={<Crown className="text-blue-600" size={24} />} 
            bg="bg-blue-50"
          />
          <StatCard 
            title="Current Intake" 
            value={currentIntake} 
            subtitle="Total students in all hostels"
            icon={<Users className="text-green-600" size={24} />} 
            bg="bg-green-50"
          />
          <StatCard 
            title="Plan Utilization" 
            value={`${(currentIntake*100)/institutePlan}%`} 
            subtitle={occupancyPercentage > 100 ? "Plan Limit Exceeded!" : "of total capacity"}
            icon={<TrendingUp className={occupancyPercentage > 100 ? "text-red-600" : "text-purple-600"} size={24} />} 
            bg={occupancyPercentage > 100 ? "bg-red-50" : "bg-purple-50"}
          />
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hostel Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage infrastructure. Total intake is limited by your Institute Plan.</p>
          </div>
          <div className="flex gap-3">
             <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search hostels..." 
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none w-64"
                />
             </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus size={18} />
              Add Hostel
            </button>
          </div>
        </div>

        {/* Hostel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map((hostel) => (
            <HostelCard 
              key={hostel.id} 
              hostel={hostel} 
              onDelete={() => handleDeleteHostel(hostel.id)} 
            />
          ))}
          
          {hostels.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <AlertCircle className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No hostels found. Add one to get started.</p>
            </div>
          )}
        </div>
      </main>

      {/* --- Modals --- */}
      {isAddModalOpen && (
        <AddHostelModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddHostel} 
        />
      )}

      {isUpgradeModalOpen && (
        <GlobalUpgradeModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => setIsUpgradeModalOpen(false)} 
          currentPlan={institutePlan}
          onConfirm={handleGlobalUpgrade}
        />
      )}
    </div>
  );
};

// --- Sub-Components ---

const StatCard = ({ title, value, subtitle, icon, bg }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`text-2xl font-bold mt-1 ${String(value).includes('%') && parseInt(value) > 100 ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
    <div className={`p-3 rounded-lg ${bg}`}>{icon}</div>
  </div>
);

const HostelCard = ({ hostel, onDelete }) => {
           const navigate = useNavigate()
  return (


    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Card Header */}
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex justify-between items-start">
          <div>

            <div  onClick={  ()=>{
       
                  navigate(`hostel/${hostel.no}`)
            } } className="text-lg font-bold text-gray-900 hover:text-green-700 transition-colors">
                        {hostel.name}
            </div>
          
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <Check size={12} className="text-green-500"/> Active • Updated {hostel.lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Card Body - Simplified (No Occupancy Bar) */}
      <div className="p-5 flex-1">
        <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg text-green-700">
                <Users size={20} />
            </div>
            <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Current Students</p>
                <p className="text-xl font-bold text-gray-900">{hostel.students}</p>
            </div>
        </div>
      </div>

      {/* Card Footer - Delete Action */}
      <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button 
          onClick={onDelete}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          title="Delete Hostel"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

// --- Add Hostel Modal ---
const AddHostelModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ name: '' ,no:''});

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.name) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Add New Hostel</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
            <input 
              type="text" 
              name="hostelName"
              placeholder="e.g. Block D - New Wing"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hostel No</label>
            <input 
              type="text" 
              name="hostelNo"
              placeholder="e.g. Block D - New Wing"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              value={formData.no}
              onChange={(e) => setFormData({...formData, no: e.target.value})}
              required
            />
          </div>
          {/* Removed Capacity Input as requested */}
          <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>Hostels do not have individual limits. Total student intake is controlled by your Institute Plan.</p>
          </div>
          
          <div className="pt-2">
            <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 rounded-lg transition-colors">
              Create Hostel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Global Upgrade Modal ---
// const GlobalUpgradeModal = ({ isOpen, onClose, currentPlan, onConfirm }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
//         <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
//           <div>
//             <h3 className="text-lg font-bold text-gray-900">Upgrade Institute Plan</h3>
//             <p className="text-xs text-gray-500">Updates capacity and mess menu.</p>
//           </div>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
//         </div>
        
//         <div className="p-6 space-y-3">
//           {availablePlans.map((plan) => {
//             const isCurrent = plan.name === currentPlan;
//             return (
//               <div 
//                 key={plan.name}
//                 className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
//                   isCurrent 
//                     ? 'border-green-500 bg-green-50 ring-1 ring-green-500' 
//                     : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
//                 }`}
//                 onClick={() => !isCurrent && onConfirm(plan.name)}
//               >
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h4 className="font-bold text-gray-900 flex items-center gap-2">
//                       {plan.name}
//                       {isCurrent && <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">Active</span>}
//                     </h4>
//                     <p className="text-sm font-medium text-gray-700 mt-1">Max Capacity: {plan.maxStudents} Students</p>
//                     <p className="text-xs text-gray-500">{plan.features}</p>
//                   </div>
//                   <div className="text-right">
//                     <span className="block font-bold text-green-700">{plan.price}</span>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

const GlobalUpgradeModal = ({ isOpen, onClose, currentPlan, onConfirm }) => {
  // Local state for the dynamic input
  const [studentCount, setStudentCount] = useState(100); 
  
  if (!isOpen) return null;

  // Calculation Logic
  const pricePerStudent = 2;
  const totalPrice = studentCount * pricePerStudent;

  const handleConfirm = () => {
    // We send a string back to handleGlobalUpgrade to keep your existing state logic
    const planString = studentCount;
    onConfirm(planString);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Customize Your Plan</h3>
            <p className="text-xs text-gray-500">Current: {currentPlan}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20}/>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              Number of Students
            </label>
            <input 
              type="number" 
              min="1"
              value={studentCount}
              onChange={(e) => setStudentCount(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg font-medium"
              placeholder="Enter student count..."
            />
          </div>

          {/* Pricing Display */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex justify-between items-center">
            <div>
              <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">Total Monthly Price</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-blue-900">₹{totalPrice}</span>
                <span className="text-blue-500 text-sm">/month</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-400">₹2.00 per student</p>
            </div>
          </div>

          {/* Features Preview */}
          <div className="text-xs text-gray-500 space-y-1">
            <p className="flex items-center gap-2">✓ Dynamic capacity for {studentCount} users</p>
            <p className="flex items-center gap-2">✓ Automatic mess menu scaling</p>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleConfirm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-200"
          >
            <CreditCard size={18} />
            Confirm Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;