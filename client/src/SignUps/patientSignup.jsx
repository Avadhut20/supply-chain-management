import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PatientSignup() {
  const [hospitals, setHospitals] = useState([]);
  const [formData, setFormData] = useState({
    hospital: '',
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    address: '',
    gender: '',
    password: '',
    dateOfBirth: '',
  });

  const navigate = useNavigate();

  // Fetch hospitals dynamically
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('http://localhost:8080/hospital/hospitalsnames');
        const data = response.data;

        console.log(data);
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

  // Handle submission
  const handleSignup = async () => {
    console.log('Form Data:', formData);

    try {
      const response = await axios.post('http://localhost:8080/patient/signup', {
        First_Name: formData.firstname,
        Last_Name: formData.lastname,
        Date_of_Birth: formData.dateOfBirth,
        hospitalName: formData.hospital,
        Email_ID: formData.email,
        phone: formData.mobile,
        address: formData.address,
        Password: formData.password,
        Gender: formData.gender,
      });
      
      alert("Patient signup successfully");
      navigate('/signIn');
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-black ">
      <div className="w-full max-w-4xl p-8 shadow-2xl rounded-2xl border ">
        <h2 className="text-3xl font-semibold text-center mb-8">Patient Sign Up</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            {/* Hospital Dropdown */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Select Hospital</label>
              <select
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Choose a hospital</option>
                {hospitals.map((hospital, index) => (
                  <option key={index} value={hospital.Hosptial_Name}>
                    {hospital.Hosptial_Name}
                  </option>
                ))}
              </select>
            </div>

            {/* First Name */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Gender */}
            <div className="mb-4">
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
          </div>

          {/* Right Column */}
          <div>
            {/* Date of Birth */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
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
            <div className="mb-4">
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
            <div className="mb-4">
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
            <div className="mb-4 ">
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
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSignup}
          className="w-full p-2 mt-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default PatientSignup;
