import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function DealerSignup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    gender: "",
    mobile: "",
    password: "",
    walletAddress: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const {
      firstName,
      lastName,
      email,
      dob,
      gender,
      mobile,
      password,
      walletAddress,
    } = formData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !dob ||
      !gender ||
      !mobile ||
      !password ||
      !walletAddress
    ) {
      return toast.error("Please fill in all fields.");
    }

    try {
      const res = await axios.post("http://localhost:8080/dealer/signup", {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        DOB: new Date(dob),
        Gender: gender,
        Mobile: mobile,
        Password: password,
        WalletAddress: walletAddress,
      });

        localStorage.setItem("walletAddress_DEALER", walletAddress);

      toast.success(res.data.message || "Signup successful!");
      setTimeout(() => navigate("/signIn"), 1500);
    } catch (err) { 
      toast.error(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <ToastContainer />
      <div className="w-full max-w-xl p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Dealer Sign Up</h2>

        {/* First Name */}
        <div className="mb-4">
          <label className="block mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* DOB */}
        <div className="mb-4">
          <label className="block mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label className="block mb-1">Mobile</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Wallet Address */}
        <div className="mb-4">
          <label className="block mb-1">Wallet Address</label>
          <input
            type="text"
            name="walletAddress"
            value={formData.walletAddress}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="0x..."
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default DealerSignup;
