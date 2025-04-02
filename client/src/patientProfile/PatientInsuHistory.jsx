

import React from 'react'
import { useState, useEffect } from 'react';
import axios from "axios"
  
function PatientInsuHistory() {
  const [insuranceData, setInsuranceData] = useState([]);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  useEffect(() => {
    const fetchInsuranceData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/insurance/PatientinsurenceHistory', {
          headers: {
            authorization: localStorage.getItem('PATIENT'),
          },
        });
        setInsuranceData(response.data.data);
       
      } catch (error) {
        console.error('Error fetching insurance history:', error);
      }
    };
    fetchInsuranceData();
  }, []);

  return (
    <div className='flex flex-col justify-center items-center p-8 min-h-screen'>
      <div>
      <h2 className=' text-center  text-2xl font-bold mb-6'>User Insurance History</h2>
      <div className='w-full max-w-7xl  max-h-[600px]  overflow-y-auto  border rounded-lg shadow-lg overflow-hidden'>
        
        {/* Header */}
        <div className='sticky top-0   z-10 grid grid-cols-10 bg-blue-400 text-white font-semibold p-3 text-center'>
        <div>Company</div>
          <div>Mobile Number</div>
          <div>Web Site</div> 
          <div>Address</div>
          <div>Policy No</div>
          <div>Policy Name</div>
          <div>Policy Tenure</div>
          <div>Base Premium</div>
          <div>Coverage Info</div>
          <div>Policy Amount</div>
        </div>

        {/* Data */}
        {insuranceData.map((insurance, index) => (
          <div
            key={index}
            className="grid  grid-cols-10 gap-4 p-4 border-b text-center hover:bg-purple-200 cursor-pointer"
            onClick={() => setSelectedInsurance(insurance)}
          >
            
            <div className="truncate px-2">{insurance.CompanyName}</div>
            <div className="truncate px-2">{insurance.Mobile_Number}</div>
            <div className="truncate px-2">{insurance.Website}</div>
            <div className="truncate px-2">{insurance.Address}</div>
            <div className="truncate px-2">{insurance.Policy_No}</div>
            <div className="truncate px-2">{insurance.Policy_Name}</div>
            <div className="truncate px-2">{insurance.Policy_Tenue}</div>
            <div className="truncate px-2">{insurance.Base_Premium}</div>
            <div className="truncate px-2">{insurance.Coverage_Info}</div>
            <div className="truncate px-2">{insurance.Policy_Amount}</div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedInsurance && (
        <div className="fixed inset-0 z-20  flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white ml-72  p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Insurance HISTORY Details</h3>
            
            <p><strong>Company:</strong> {selectedInsurance.companyName}</p>
            <p><strong>Patient Name:</strong> {selectedInsurance.mobileNumber}</p>
            <p><strong>Email:</strong> {selectedInsurance.webSite}</p>
            <p><strong>Address:</strong> {selectedInsurance.address}</p>
            <p><strong>Policy No:</strong> {selectedInsurance.policyNo}</p>
            <p><strong>Policy Name:</strong> {selectedInsurance.policyName}</p>
            <p><strong>Policy Tenure:</strong> {selectedInsurance.policyTenure}</p>
            <p><strong>Base Premium:</strong> {selectedInsurance.basePremium}</p>
            <p><strong>Coverage Info:</strong> {selectedInsurance.coverageInfo}</p>
            <p><strong>Policy Amount:</strong> {selectedInsurance.policyAmount}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => setSelectedInsurance(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default PatientInsuHistory