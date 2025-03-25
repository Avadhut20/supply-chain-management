import React, { useState, useEffect } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';

function PatientSignup() {
  const [hospitals, setHospitals] = useState([]);
  const [formData, setFormData] = useState({
    hospital: '',
    name: '',
    email: '',
    mobile: '',
    address: '',
    gender: '',
    password: '',
  });

  const navigate = useNavigate();

  // Fetch hospitals dynamically (replace with your API endpoint)
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch('/api/hospitals');
        const data = await response.json();
        setHospitals(data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };
    fetchHospitals();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submission without HTML form
  const handleSignup =async () => {
    console.log('Form Data:', formData);
    
    // const response = await axios.post("",{} )
     navigate("/signIn")
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl space-y-4">
        <h2 className="text-2xl font-semibold text-center mb-4">Patient Sign Up</h2>

        {/* Hospital Dropdown */}
        <div>
          <label className="block mb-1 text-sm font-medium">Select Hospital</label>
          <select
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Choose a hospital</option>
            {hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.name}>
                {hospital.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input Fields */}
        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'Email ID', name: 'email', type: 'email' },
          { label: 'Mobile Number', name: 'mobile', type: 'tel' },
          { label: 'Address', name: 'address', type: 'text' },
          { label: 'Password', name: 'password', type: 'password' },
        ].map((field) => (
          <div key={field.name}>
            <label className="block mb-1 text-sm font-medium">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}

        {/* Gender Dropdown */}
        <div>
          <label className="block mb-1 text-sm font-medium">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Gender</option>
            {['MALE', 'FEMALE', 'OTHERS'].map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
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
  );
}

export default PatientSignup;
