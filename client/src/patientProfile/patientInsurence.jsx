import React, { useState, useEffect } from "react";
import axios from "axios";
import Close from "../icons/Close";

function PatientInsurance() {
  const [insuranceData, setInsuranceData] = useState([]);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchInsuranceData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/insurance/list",
          {
            headers: {
              authorization: localStorage.getItem("PATIENT"),
            },
          }
        );

        if (Array.isArray(response.data.data)) {
          setInsuranceData(
            response.data.data.map((item) => ({
              id: item.T_ID,
              company_name: item.CompanyName,
              company_mobile: item.Mobile_Number,
              company_website: item.Website,
              company_address: item.Address,
              policy_no: item.Policy_No,
              policy_name: item.Policy_Name,
              base_premium: item.Base_Premium,
              policy_amount: item.Policy_Amount,
              coverage_info: item.Coverage,
              policy_tenure: item.Policy_Tenure,
              company_email: item.Email_id,
            }))
          );
        } else {
          console.error("Invalid data format received:", response.data);
        }
      } catch (error) {
        console.error("Error fetching insurance data:", error);
      }
    };

    fetchInsuranceData();
  }, []);

  const handleSelect = (insurance) => {
    setSelectedInsurance(insurance);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    //     "CompanyName":   "birla",
    // "Mobile_Number":"848448484848",
    // "Website":   "birla.com",
    // "Address":"DangeChowk",
    // "Policy_No":   "3",
    // "Policy_Name":"star health",
    // "Policy_Tenue":  "12121" ,
    // "Base_Premium":"222.222",
    // "Coverage_Info":   "ALL",
    // "Policy_Amount":"99.99",
    // "CompanyEmail_ID":   "sdasdsa.emailid"
    console.log(selectedInsurance);
    if (selectedInsurance) {
      const response = await axios.post(
        "http://localhost:8080/insurance/patientInsurenceInfo",
        
        {
          CompanyName: selectedInsurance.company_name,
          CompanyID: selectedInsurance.id,
          Mobile_Number: selectedInsurance.company_mobile,
          Website: selectedInsurance.company_website,
          Address: selectedInsurance.company_address,
          Policy_No: selectedInsurance.policy_no,
          Policy_Name: selectedInsurance.policy_name,
          Policy_Tenue: selectedInsurance.policy_tenure,
          Base_Premium: selectedInsurance.base_premium,
          Coverage_Info: selectedInsurance.coverage_info,
          Policy_Amount: selectedInsurance.policy_amount,
          CompanyEmail_ID: selectedInsurance.company_email,
        }
        ,{
          headers: {
            authorization: localStorage.getItem("PATIENT"),
          },
        }
      );

      console.log(response.data);
       alert(response.data.message);

    } else {
      alert("Please select an insurance policy.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-7xl flex flex-col gap-5 shadow-2xl rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-black text-center mb-4">
          Select Insurance Policy
        </h2>

        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-9 font-semibold text-black bg-blue-100 p-3 sticky top-0 z-10 text-center">
            <div>Select</div>
            <div>ID</div>
            <div>Company Name</div>
            <div>Policy No</div>
            <div>Policy Name</div>
            <div>Policy Tenure</div>
            <div>Base Premium</div>
            <div>Coverage Info</div>
            <div>Policy Amount</div>
          </div>

          <div className="overflow-y-auto max-h-[460px] divide-y">
            {insuranceData.map((insurance) => (
              <div
                key={insurance.id}
                className="grid grid-cols-9 p-3 hover:bg-blue-400 cursor-pointer text-center items-center"
                onClick={() => handleSelect(insurance)}
              >
                <div>
                  <input
                    type="radio"
                    name="selectedInsurance"
                    checked={selectedInsurance?.id === insurance.id}
                    onChange={() => handleSelect(insurance)}
                    className="mr-2 size-4"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div>{insurance.id}</div>
                <div>{insurance.company_name}</div>
                <div>{insurance.policy_no}</div>
                <div>{insurance.policy_name}</div>
                <div>{insurance.policy_tenure}</div>
                <div>{insurance.base_premium}</div>
                <div>{insurance.coverage_info}</div>
                <div>{insurance.policy_amount}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            SAVE
          </button>
        </div>

        {isModalOpen && selectedInsurance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="p-6 bg-white rounded-lg shadow-lg w-1/3 relative">
              <h3 className="text-xl font-semibold mb-4">Insurance Details</h3>
              <p>
                <strong>Company:</strong> {selectedInsurance.company_name}
              </p>
              <p>
                <strong>Policy No:</strong> {selectedInsurance.policy_no}
              </p>
              <p>
                <strong>Policy Name:</strong> {selectedInsurance.policy_name}
              </p>
              <p>
                <strong>Tenure:</strong> {selectedInsurance.policy_tenure}
              </p>
              <p>
                <strong>Base Premium:</strong> {selectedInsurance.base_premium}
              </p>
              <p>
                <strong>Coverage Info:</strong>{" "}
                {selectedInsurance.coverage_info}
              </p>
              <p>
                <strong>Policy Amount:</strong>{" "}
                {selectedInsurance.policy_amount}
              </p>
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientInsurance;
