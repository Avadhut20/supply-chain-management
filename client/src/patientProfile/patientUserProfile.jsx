import React, { useState } from 'react';

function PatientUserProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    oldPassword: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    birthDate: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle profile update
  const handleUpdate = () => {
    console.log('Updated Data:', formData);
    // Add your API call to update user profile
  };

  return (
    <div className="w-full h-screen flex items-center justify-center  text-black">
      <div className="w-full max-w-4xl p-8 shadow-xl rounded-2xl border">
        <h2 className="text-3xl font-semibold mb-8 text-center">Edit Profile</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block mb-1 text-sm font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-1 text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
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
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block mb-1 text-sm font-medium">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Old Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          className="w-full p-3 mt-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}

export default PatientUserProfile;