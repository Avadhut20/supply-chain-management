import axios from 'axios';
import React, { useState } from 'react';

function InsuranceDetails() {
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    mobile: '',
    website: '',
    address: '',
    policyNo: '',
    policyName: '',
    policyTenure: '',
    basePremium: '',
    coverage: '',
    policyAmount: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const response= axios.post("http://localhost:8080/insurance/insurancedetails", formData,{
      headers: {
        Authorization: localStorage.getItem("INSURANCE"),
      },
    })
  
    console.log(response.data);
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-4xl  p-8 shadow-2xl rounded-lg">
        <h2 className="text-2xl font-bold text-black mb-6">Insurance Details</h2>
        
        {/* Email Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Company Information */}
        <fieldset className="mb-6 border-t pt-4">
          <legend className="text-lg font-semibold text-black">Company Information</legend>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} className="p-2 border rounded-lg" />
            <input type="tel" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} className="p-2 border rounded-lg" />
            <input type="text" name="website" placeholder="Website" value={formData.website} onChange={handleChange} className="p-2 border rounded-lg" />
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="p-2 border rounded-lg" />
          </div>
        </fieldset>

        {/* Medical Insurance Form Details */}
        <fieldset className="mb-6 border-t pt-4">
          <legend className="text-lg font-semibold text-black">Medical Insurance Form Details</legend>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <input type="text" name="policyNo" placeholder="Policy No" value={formData.policyNo} onChange={handleChange} className="p-2 border rounded-lg" />
            <input type="text" name="policyName" placeholder="Policy Name" value={formData.policyName} onChange={handleChange} className="p-2 border rounded-lg" />
            <input type="number" name="policyTenure" placeholder="Policy Tenure (Years)" value={formData.policyTenure} onChange={handleChange} className="p-2 border rounded-lg" />
            <input type="text" name="basePremium" placeholder="Base Premium" value={formData.basePremium} onChange={handleChange} className="p-2 border rounded-lg" />
          </div>
        </fieldset>

        {/* Coverage */}
        <fieldset className="mb-6 border-t pt-4">
          <legend className="text-lg font-semibold text-black">Coverage</legend>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <input type="text" name="coverage" placeholder="Coverage" value={formData.coverage} onChange={handleChange} className="p-2 border rounded-lg" />
            <input type="text" name="policyAmount" placeholder="Policy Amount" value={formData.policyAmount} onChange={handleChange} className="p-2 border rounded-lg" />
          </div>
        </fieldset>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-purple-600 text-black rounded-lg hover:bg-purple-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default InsuranceDetails;
