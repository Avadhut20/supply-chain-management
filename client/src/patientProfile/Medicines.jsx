import React, { useEffect, useState } from "react";
import axios from "axios";
import Web3 from "web3";
import MedicineTransactionManager from "../../../blockchain/build/contracts/MedicineTransactionManager.json";

const ETH_RATE_INR = 213509.95; // Update this value based on live rate
const CONTRACT_ADDRESS = "0x963a0C451AE68f67888cC45CF3679612dfFC7EB2"; // Your deployed contract address

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [buyingId, setBuyingId] = useState(null);
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const initWeb3AndContract = async () => {
      if (!window.ethereum) {
        alert("MetaMask is not installed");
        return;
      }

      try {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        setWeb3(web3Instance);
        setAccount(accounts[0]);

        const contractInstance = new web3Instance.eth.Contract(
          MedicineTransactionManager.abi,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);
      } catch (error) {
        console.error("Web3 init error:", error);
      }
    };

    initWeb3AndContract();
  }, []);

  useEffect(() => {
    const fetchMedicines = async () => {
      const token = localStorage.getItem("PATIENT");
      if (!token) return alert("Login required");

      try {
        const res = await axios.get("http://localhost:8080/patient/medicines", {
          headers: { Authorization: token },
        });
        setMedicines(res.data);
      } catch (error) {
        console.error("Fetch medicines error:", error);
      }
    };

    fetchMedicines();
  }, []);

  const handleBuy = async (medicine) => {
    if (!web3 || !contract || !account) {
      alert("Web3 or contract or account not initialized");
      return;
    }

    try {
      setBuyingId(medicine.id);
      const token = localStorage.getItem("PATIENT");
      if (!token) return alert("Login required");

      const priceInINR = parseFloat(medicine.price);
      const priceInETH = priceInINR / ETH_RATE_INR;
      const priceInWei = web3.utils.toWei(priceInETH.toString(), "ether");

      const manufacturerAddress = medicine.manufacturer?.walletAddress || "";
      const hospitalAddress = medicine.hospital?.walletAddress || "";
      const dealerAddress = medicine.dealer?.walletAddress || "";

      if (
        !web3.utils.isAddress(manufacturerAddress) ||
        !web3.utils.isAddress(hospitalAddress) ||
        !web3.utils.isAddress(dealerAddress)
      ) {
        throw new Error("One or more wallet addresses are invalid");
      }

      // Split payment
      const hospitalShare = (priceInETH / 2).toString();
      const dealerShare = (priceInETH / 2).toString();

      const hospitalShareWei = web3.utils.toWei(hospitalShare, "ether");
      const dealerShareWei = web3.utils.toWei(dealerShare, "ether");

      const tx = await contract.methods
        .createOrder(
          manufacturerAddress,
          hospitalAddress,
          dealerAddress,
          hospitalShareWei,
          dealerShareWei
        )
        .send({ from: account, value: priceInWei });

      console.log("Transaction success:", tx.transactionHash);

      await axios.post(
        `http://localhost:8080/patient/buy/${medicine.id}`,
        {},
        { headers: { Authorization: token } }
      );

      setMedicines((prev) => prev.filter((m) => m.id !== medicine.id));
      alert("Medicine purchased successfully!");
    } catch (error) {
      console.error("Buy error:", error);
      alert("Transaction failed: " + error.message);
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
