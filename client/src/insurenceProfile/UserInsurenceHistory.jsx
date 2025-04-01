import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserInsuranceHistory() {
  const [insuranceData, setInsuranceData] = useState([

    {
      patientName: "John Doe",
      patientEmail: "john@example.com",
      companyName: "ABC Insurance",
      address: "123 Main St, NY",
      policyNo: "POL12345",
      policyName: "Health Secure Plan",
      policyTenure: "5 years",
      basePremium: "$500/year",
      coverageInfo: "Covers hospitalization and critical illness",
      policyAmount: "$50,000"
    },
    {
      patientName: "Jane Smith",
      patientEmail: "jane@example.com",
      companyName: "XYZ Insurance",
      address: "456 Elm St, CA",
      policyNo: "POL67890",
      policyName: "Life Cover Plus",
      policyTenure: "10 years",
      basePremium: "$300/year",
      coverageInfo: "Includes accidental coverage",
      policyAmount: "$100,000"
    }
  ]);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  useEffect(() => {
    const fetchInsuranceData = async () => {
      try {
        // const response = await axios.get('http://localhost:8080/insurance/history', {
        //   headers: {
        //     authorization: localStorage.getItem('INSURANCE_TOKEN'),
        //   },
        // });
        // setInsuranceData(response.data.history);
      } catch (error) {
        // console.error('Error fetching insurance history:', error);
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
            <div className="truncate px-2">{insurance.patientName}</div>
            <div className="truncate px-2">{insurance.patientEmail}</div>
            <div className="truncate px-2">{insurance.companyName}</div>
            <div className="truncate px-2">{insurance.address}</div>
            <div className="truncate px-2">{insurance.policyNo}</div>
            <div className="truncate px-2">{insurance.policyName}</div>
            <div className="truncate px-2">{insurance.policyTenure}</div>
            <div className="truncate px-2">{insurance.basePremium}</div>
            <div className="truncate px-2">{insurance.coverageInfo}</div>
            <div className="truncate px-2">{insurance.policyAmount}</div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedInsurance && (
        <div className="fixed inset-0   flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white ml-72  p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Insurance Details</h3>
            <p><strong>Patient Name:</strong> {selectedInsurance.patientName}</p>
            <p><strong>Email:</strong> {selectedInsurance.patientEmail}</p>
            <p><strong>Company:</strong> {selectedInsurance.companyName}</p>
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
  );
}

export default UserInsuranceHistory;





