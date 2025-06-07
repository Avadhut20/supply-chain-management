import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminSignup() {

  const handleClick = () => {
    toast.success('Admin signed up successfully!');
    // or toast.error('Something went wrong!');
  };

  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center'>
      <h1 className="text-2xl font-semibold mb-4">Admin Signup</h1>
      
      <button 
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Simulate Signup
      </button>

      {/* Toast notifications will show up here */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default AdminSignup;
