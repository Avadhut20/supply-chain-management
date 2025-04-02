import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserInsuranceHistory() {
  const [insuranceData, setInsuranceData] = useState([]);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  useEffect(() => {
    const fetchInsuranceData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/insurance/insurenceHistory', {
          headers: {
            authorization: localStorage.getItem('INSURANCE'),
          },
        });
        setInsuranceData(response.data.data);
      
        console.log(insuranceData);
      
      } catch (error) {
        console.error('Error fetching insurance history:', error);
      }
    };
    fetchInsuranceData();
  }, []);

  return (
    <div className='flex flex-col items-center p-8 min-h-screen'>
      <h2 className='text-2xl font-bold mb-6'>User Insurance History</h2>
      <div className='w-full max-w-7xl border rounded-lg shadow-lg overflow-hidden'>
        
        {/* Header */}
        <div className='grid grid-cols-10 bg-purple-600 text-white font-semibold p-3 text-center'>
          <div>Patient Name</div>
          <div>Email</div>
          <div>Company</div>
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
            className="grid grid-cols-10 gap-4 p-3 border-b text-center hover:bg-purple-200 cursor-pointer"
            onClick={() => setSelectedInsurance(insurance)}
          >
            <div className="truncate px-2">{insurance.PatientName}</div>
            <div className="truncate px-2">{insurance.PatientEmail}</div>
            <div className="truncate px-2">{insurance.CompanyName}</div>
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
        <div className="fixed inset-0   flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white ml-72  p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Insurance Details</h3>
            <p><strong>Patient Name:</strong> {selectedInsurance.PatientName}</p>
            <p><strong>Email:</strong> {selectedInsurance.PatientEmail}</p>
            <p><strong>Company:</strong> {selectedInsurance.CompanyName}</p>
            <p><strong>Address:</strong> {selectedInsurance.Address}</p>
            <p><strong>Policy No:</strong> {selectedInsurance.Policy_No}</p>
            <p><strong>Policy Name:</strong> {selectedInsurance.Policy_Name}</p>
            <p><strong>Policy Tenure:</strong> {selectedInsurance.Policy_Tenue}</p>
            <p><strong>Base Premium:</strong> {selectedInsurance.Base_Premium}</p>
            <p><strong>Coverage Info:</strong> {selectedInsurance.Coverage_Info}</p>
            <p><strong>Policy Amount:</strong> {selectedInsurance.Policy_Amount}</p>
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
  );
}

export default UserInsuranceHistory;





