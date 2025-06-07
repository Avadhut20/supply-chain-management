import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    walletAddress: '',  // added wallet address here
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('http://localhost:8080/hospital/hospitalsnames');
        setHospitals(response.data);
      } catch {
        toast.error("Error fetching hospitals");
      }
    };
    fetchHospitals();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!formData.walletAddress) {
      toast.error("Please enter wallet address");
      return;
    }

    try {
      await axios.post('http://localhost:8080/patient/signup', {
        First_Name: formData.firstname,
        Last_Name: formData.lastname,
        Date_of_Birth: formData.dateOfBirth,
        hospitalName: formData.hospital,
        Email_ID: formData.email,
        phone: formData.mobile,
        address: formData.address,
        Password: formData.password,
        Gender: formData.gender,
        walletAddress: formData.walletAddress,
      });
       localStorage.setItem("walletAddress_PATIENT", formData.walletAddress);
      toast.success("Patient signed up successfully");
      navigate('/signIn');
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-black">
      <ToastContainer />
      <div className="w-full max-w-4xl p-8 shadow-2xl rounded-2xl border">
        <h2 className="text-3xl font-semibold text-center mb-8">Patient Sign Up</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Select Hospital</label>
              <select
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Choose a hospital</option>
                {hospitals.map((h, i) => (
                  <option key={i} value={h.Hosptial_Name}>{h.Hosptial_Name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHERS">Others</option>
              </select>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Email ID</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

           
              <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Wallet Address</label>
              <input
                type="text"
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleChange}
                placeholder="0x..."
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          

          </div>
        </div>

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
