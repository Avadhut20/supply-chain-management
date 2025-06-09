import React, { useEffect, useState } from "react";
import axios from "axios";
import Web3 from "web3";
import MedicineTransactionManager from "../../../blockchain/build/contracts/MedicineTransactionManager.json";
import  { BN } from "web3";
const ETH_RATE_INR = 213509.95; // 1 ETH = ₹213509.95

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [buyingId, setBuyingId] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);

  const CONTRACT_ADDRESS = "0x963a0C451AE68f67888cC45CF3679612dfFC7EB2"; // Replace with your deployed address

  // Initialize web3 and contract
  useEffect(() => {
    const initWeb3AndContract = async () => {
      try {
        if (!window.ethereum) {
          alert("Please install MetaMask!");
          return;
        }

        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        setWeb3(web3Instance);

        const contractInstance = new web3Instance.eth.Contract(
          MedicineTransactionManager.abi,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);
      } catch (error) {
        console.error("Error initializing web3 or contract:", error);
      }
    };

    initWeb3AndContract();
  }, []);

  // Fetch prescribed medicines from backend
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem("PATIENT");
        if (!token) return alert("Please login first.");

        const res = await axios.get("http://localhost:8080/patient/medicines", {
          headers: { Authorization: token },
        });

        setMedicines(res.data);
      } catch (err) {
        console.error("Failed to fetch medicines", err);
        alert("Failed to load medicines.");
      }
    };

    fetchMedicines();
  }, []);

  // Convert INR price to Wei (ETH) using web3 instance utils
  const convertINRtoWei = (priceInINR) => {
    if (!web3) return "0";
    const ethAmount = priceInINR / ETH_RATE_INR;
    return web3.utils.toWei(ethAmount.toFixed(18), "ether");
  };

  const handleBuy = async (medicine) => {
  try {
    if (!contract) throw new Error("Smart contract is not initialized");
    if (!account) throw new Error("Wallet not connected");
    if (!web3) throw new Error("Web3 is not initialized");

    setBuyingId(medicine.id);

    const token = localStorage.getItem("PATIENT");
    if (!token) throw new Error("Please login first.");

    const priceInWei = convertINRtoWei(medicine.price);
    const priceBN = new BN(priceInWei);  // Use BN here

    // 50-50 split of price
    const hospitalShare = priceBN.divn(2);
    const dealerShare = priceBN.sub(hospitalShare);

      // Extract addresses, fallback to empty string
      const manufacturerAddress = medicine.manufacturer?.walletAddress || "";
      const hospitalAddress = medicine.hospital?.walletAddress || "";
      const dealerAddress = medicine.dealer?.walletAddress || "";

      if (
        !web3.utils.isAddress(manufacturerAddress) ||
        !web3.utils.isAddress(hospitalAddress) ||
        !web3.utils.isAddress(dealerAddress)
      ) {
        throw new Error("One or more Ethereum addresses are invalid");
      }

      // Call smart contract method createOrder
      const tx = await contract.methods
        .createOrder(
          manufacturerAddress,
          hospitalAddress,
          dealerAddress,
          hospitalShare.toString(),
          dealerShare.toString()
        )
        .send({ from: account, value: priceBN.toString() });

      console.log("Transaction successful, hash:", tx.transactionHash);

      // Notify backend of purchase
      await axios.post(
        `http://localhost:8080/patient/buy/${medicine.id}`,
        {},
        { headers: { Authorization: token } }
      );

      // Remove purchased medicine from list
      setMedicines((prev) => prev.filter((m) => m.id !== medicine.id));
      alert("Medicine purchased successfully!");
    } catch (err) {
      console.error("Error during purchase:", err);
      alert("Failed to buy medicine. " + (err.message || ""));
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Prescribed Medicines</h2>
      {medicines.length === 0 ? (
        <p>No medicines prescribed yet.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Price (₹)</th>
              <th className="py-2 px-4 border">Manufacturer</th>
              <th className="py-2 px-4 border">Quantity</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med, index) => (
              <tr key={med.id} className="text-center">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{med.name}</td>
                <td className="py-2 px-4 border">₹{med.price}</td>
                <td className="py-2 px-4 border">{med.manufacturer?.name || "N/A"}</td>
                <td className="py-2 px-4 border">{med.quantity}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleBuy(med)}
                    disabled={buyingId === med.id}
                    className={`px-4 py-1 rounded text-white ${
                      buyingId === med.id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {buyingId === med.id ? "Buying..." : "Buy"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Medicines;
