import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function InsuranceSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
    walletAddress: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const { name, email, mobile, address, password, walletAddress } = formData;

    if (!name || !email || !mobile || !address || !password || !walletAddress) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/insurance/signup', formData);
      toast.success(response.data.message || "Signup successful!");

      
      localStorage.setItem("walletAddress_INSURANCE", formData.walletAddress);

      setTimeout(() => {
        navigate('/signIn');
      }, 1500);
    } catch (error) {
      if (error?.response?.status === 500) {
        toast.error("Please fill all fields.");
      } else {
        toast.error(error?.response?.data?.message || "Signup failed!");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-black">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-lg p-8 shadow-2xl rounded-2xl border">
        <h2 className="text-3xl font-semibold text-center mb-8">Insurance Sign Up</h2>

        <div className="space-y-6">
          {/* Form Inputs */}
          {["name", "email", "mobile", "address", "walletAddress", "password"].map((field) => (
            <div key={field}>
              <label className="block mb-1 text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type={
                  field === "email"
                    ? "email"
                    : field === "password"
                    ? "password"
                    : "text"
                }
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          {/* Submit Button */}
          <button
            onClick={handleSignup}
            className="w-full p-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default InsuranceSignup;
