import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HospitalSignup() {
  const [formData, setFormData] = useState({
    hospitalName: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:8080/hospital/signup',{
        Hosptial_Name:formData.hospitalName,
        Email_ID:formData.email,
        Mobile:formData.mobile,
        Password:formData.password,
        Address:formData.address
      } );
     
    //  alert(response.data.message +"- -> "+response.data.hospital.Hosptial_Name ) ;
      navigate('/signIn');
    } catch (error) {
      console.log(error);
      if(error.status === 500){
        alert("Fill all filelds");
      }
      else{
      alert(error.response.data.message);
    }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-black">
      <div className="w-full max-w-lg p-8 shadow-2xl rounded-2xl border">
        <h2 className="text-3xl font-semibold text-center mb-8">Hospital Sign Up</h2>

        <div className="space-y-6">
          {/* Hospital Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">Hospital Name</label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">Email ID</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block mb-1 text-sm font-medium">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
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

export default HospitalSignup;