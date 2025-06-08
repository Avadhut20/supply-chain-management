import axios from "axios";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ManufacturerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    mobile: "",
    password: "",
    walletAddress: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.walletAddress) {
      toast.error("Please enter wallet address");
      return;
    }

    try {
      await axios.post("http://localhost:8080/manufacture/signup", formData);
      localStorage.setItem("walletAddress_MANUFACTURE", formData.walletAddress);
      toast.success("MANUFATURE signed up successfully");
      navigate("/signIn");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Manufacturer Signup
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="date"
          name="dob"
           placeholder="DOB"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <select
          name="gender"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="walletAddress"
          placeholder="Wallet Address"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default ManufacturerSignup;
