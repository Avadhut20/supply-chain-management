import React from 'react'
import { useState,useEffect } from 'react';

function PatientMedTrack() {
  const [insuranceData, setInsuranceData] = useState([

    {
      OrderId: "ABC Insurance",
      TrackingID:"59599595",
      Email :"http:/dmksmd.com",
      Hospital: "123 Main St, NY",
      Medecine: "POL12345",
      Company: "5 years",
      Quantity: "$500/year",
      OrderDate_Time: "Covers hospitalization and critical illness",
      Total_Cost: "$50,000"
    },
    {      
      OrderId: "qasdsdC Insurance",
      TrackingID:"59asd599595",
      Email :"http:/dmksmd.com",
      Hospital: "123 Main St, NY",
      Medecine: "POL12345",
      Company: "15 years",
      Quantity: "$81000/year",
      OrderDate_Time: "Covers hospitalization and critical illness",
      Total_Cost: "$80,000"
    },
 ,
    
   
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
    <div className='flex flex-col justify-center items-center p-8 min-h-screen'>
      <div>
      <h2 className=' text-center  text-2xl font-bold mb-6'>User Insurance History</h2>
      <div className='w-full max-w-7xl  max-h-[600px]  overflow-y-auto  border rounded-lg shadow-lg overflow-hidden'>
        
        {/* Header */}
        <div className='sticky top-0   z-10 grid grid-cols-9 bg-blue-400 text-white font-semibold p-3 text-center'>
        <div>OrderId</div>
          <div>TrackingID</div>
          <div>Email</div> 
          <div>Hospital Name</div>  
          <div>Medicine Name</div>
          <div>Company</div>
          <div>Quantity</div>
          <div>OrdeDate&Time</div>
          <div>Total Cost</div>
        </div>

        {/* Data */}
        {insuranceData.map((insurance, index) => (
          <div
            key={index}
            className="grid  grid-cols-9 gap-4 p-4 border-b text-center hover:bg-purple-200 cursor-pointer"
            onClick={() => setSelectedInsurance(insurance)}
          >
            
            <div className="truncate px-2">{insurance.OrderId}</div>
            <div className="truncate px-2">{insurance.TrackingID}</div>
            <div className="truncate px-2">{insurance.Email}</div>
            <div className="truncate px-2">{insurance.Hospital}</div>
            <div className="truncate px-2">{insurance.Medecine}</div>
            <div className="truncate px-2">{insurance.Company}</div>
            <div className="truncate px-2">{insurance.Quantity}</div>
            <div className="truncate px-2">{insurance.OrderDate_Time}</div>
            <div className="truncate px-2">{insurance.Total_Cost}</div>
            
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedInsurance && (
        <div className="fixed inset-0 z-20  flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white ml-72  p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">MEDICINE Details</h3>
            
            <p><strong>Company:</strong> {selectedInsurance.OrderId}</p>
            <p><strong>Patient Name:</strong> {selectedInsurance.TrackingID}</p>
            <p><strong>Email:</strong> {selectedInsurance.Email}</p>
            <p><strong>Address:</strong> {selectedInsurance.Hospital}</p>
            <p><strong>Policy No:</strong> {selectedInsurance.Medecine}</p>
            <p><strong>Policy Name:</strong> {selectedInsurance.Company}</p>
            <p><strong>Policy Tenure:</strong> {selectedInsurance.Quantity}</p>
            <p><strong>Base Premium:</strong> {selectedInsurance.OrderDate_Time}</p>
            <p><strong>Coverage Info:</strong> {selectedInsurance.Total_Cost}</p>
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

export default PatientMedTrack