import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

function SignIn() {
  
  const navigate  = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle sign-in without HTML form
  const handleSignIn = async () => {
  try{console.log(formData)
    
     const response = await axios.post("http://localhost:8080/auth/signin",
      {
       email:formData.email,
       password:formData.password,
       role:formData.role
     }); 
     console.log(formData)
     if(formData.role == "PATIENT") {
      localStorage.setItem(formData.role,response.data.token);
      alert(response.data.message);
      navigate("/PatientUserProfile")
     }
     if(formData.role == "HOSPITAL") {
      localStorage.setItem(formData.role,response.data.token);
      alert(response.data.message);
      navigate("/HospUserProfile")
     }
  
  }
  
  catch(e){
    alert(e)
  }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  text-black">
      <div className="w-full max-w-md p-6  shadow-2xl rounded-2xl border space-y-4">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>

        {/* Email Input */}
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Role Dropdown */}
        <div>
          <label className="block mb-1 text-sm font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Role</option>
            {['PATIENT', 'HOSPITAL', 'INSURANCE', 'DEALER', 'ADMIN'].map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSignIn}
          className="w-full p-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default SignIn;
