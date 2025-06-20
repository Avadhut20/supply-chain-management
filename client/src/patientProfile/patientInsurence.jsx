import React, { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import InsuranceManagerABI from "../../../blockchain/build/contracts/InsuranceManager.json";
import PatientPolicyABI from "../../../blockchain/build/contracts/PatientPolicy.json";

const INSURANCE_MANAGER_ADDRESS = "0x94D3A875Af1a764B64e253B6eb70B309bDE70C70";
const PATIENT_POLICY_ADDRESS = "0x95a515f2dC1C7bf3cFc97fc3181e79ea64e8d64A";

function PatientInsurance() {
  const [insuranceData, setInsuranceData] = useState([]);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ETH_PRICE_IN_INR = 213789.87; // 1 ETH = ₹213789.87

  useEffect(() => {
    const fetchInsuranceData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/insurance/list", {
          headers: {
            authorization: localStorage.getItem("PATIENT"),
          },
        });

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
              base_premium: item.Base_Premium, // in INR
              policy_amount: item.Policy_Amount,
              coverage_info: item.Coverage,
              policy_tenure: item.Policy_Tenure,
              company_email: item.Email_id,
            }))
          );
        } else {
          console.error("Invalid data format:", response.data);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!selectedInsurance) {
      alert("Please select an insurance policy.");
      return;
    }

    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const walletAddress = localStorage.getItem("walletAddress_PATIENT");
        if (!walletAddress) {
          alert("Wallet address not found in localStorage.");
          return;
        }

        const insuranceManagerContract = new web3.eth.Contract(
          InsuranceManagerABI.abi,
          INSURANCE_MANAGER_ADDRESS
        );

        const patientPolicyContract = new web3.eth.Contract(
          PatientPolicyABI.abi,
          PATIENT_POLICY_ADDRESS
        );

        const policyId = selectedInsurance.id;

        const basePremiumINR = parseFloat(selectedInsurance.base_premium);
        const basePremiumETH = basePremiumINR / ETH_PRICE_IN_INR;
        const basePremiumWei = web3.utils.toWei(basePremiumETH.toString(), "ether");

        await patientPolicyContract.methods
          .purchasePolicy(policyId)
          .send({
            from: walletAddress,
            value: basePremiumWei,
          });

        alert("Policy purchased on blockchain successfully!");

        // Save to backend
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
          },
          {
            headers: {
              authorization: localStorage.getItem("PATIENT"),
            },
          }
        );

        alert(response.data.message);
        setIsModalOpen(false);
      } else {
        alert("MetaMask is not installed.");
      }
    } catch (error) {
      console.error("Transaction or save failed:", error);
      alert("Something went wrong. Check console for details.");
    }
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
            <div>Base Premium (₹)</div>
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
              <p><strong>Company:</strong> {selectedInsurance.company_name}</p>
              <p><strong>Policy No:</strong> {selectedInsurance.policy_no}</p>
              <p><strong>Policy Name:</strong> {selectedInsurance.policy_name}</p>
              <p><strong>Tenure:</strong> {selectedInsurance.policy_tenure}</p>
              <p><strong>Base Premium (₹):</strong> {selectedInsurance.base_premium}</p>
              <p><strong>Coverage Info:</strong> {selectedInsurance.coverage_info}</p>
              <p><strong>Policy Amount:</strong> {selectedInsurance.policy_amount}</p>
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
