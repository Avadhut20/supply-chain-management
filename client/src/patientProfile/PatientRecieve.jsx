import React, { useEffect, useState } from "react";
import axios from "axios";
import Web3 from "web3";
import MedicineTransactionManager from "../../../blockchain/build/contracts/MedicineTransactionManager.json";

const CONTRACT_ADDRESS = "0x4A8EFB4754C2fC12BBDa0450261277502305C78B";

const PatientRecieve = () => {
  const [orders, setOrders] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  // Initialize Web3 and contract
  const initWeb3 = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        const contractInstance = new web3Instance.eth.Contract(
          MedicineTransactionManager.abi,
          CONTRACT_ADDRESS
        );
        setWeb3(web3Instance);
        setContract(contractInstance);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Failed to initialize web3", error);
        alert("Web3 initialization failed. Check console.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("PATIENT");
      const { data } = await axios.get("http://localhost:8080/patient/receive-orders", {
        headers: { Authorization: token },
      });
      setOrders(data.orders || []);
      console.log(data.orders);
    } catch (error) {
      console.error("Failed to fetch patient receive orders", error);
      alert("Error fetching orders. See console for details.");
    }
  };

  // Handle receiving order
  const handleReceive = async (order) => {
    try {
      if (!contract || !account) {
        alert("Connect your wallet to proceed.");
        return;
      }

      const orderId = Number(order.onChainOrderId);
      if (isNaN(orderId)) {
        alert("Invalid onChainOrderId.");
        return;
      }
      console.log("Received order ID:", orderId);

      // Use the correct contract method (public mapping getter)
      const orderDetails = await contract.methods.orders(orderId).call();
      console.log("On-chain order details:", orderDetails);
      console.log("address:", orderDetails.patient);
      console.log(orderDetails.patient === orderDetails.dealer);

      if (orderDetails.patient.toLowerCase() !== account.toLowerCase()) {
        alert("Connected wallet does not match on-chain patient address.");
        return;
      }

      console.log("Simulating transaction for order:", orderId);
      await contract.methods.patientReceived(orderId).call({ from: account });

      console.log("Sending transaction from:", account);
      await contract.methods.patientReceived(orderId).send({ from: account });

      // Backend update
      const token = localStorage.getItem("PATIENT");
      await axios.post(`http://localhost:8080/patient/receive/${order.id}`, {}, {
        headers: { Authorization: token },
      });

      alert("✅ Order marked as received on-chain and backend!");
      fetchOrders();
    } catch (error) {
      console.error("❌ Error during receive flow:", error);
      alert("Failed to mark order as received. See console for more info.");
    }
  };

  useEffect(() => {
    initWeb3();
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Received Orders</h2>
      {orders.length === 0 ? (
        <p>No new shipments</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Medicine</th>
              <th className="px-4 py-2 border">Quantity</th>
                <th className="py-2 px-4 border">Price (₹)</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              // console.log(order);
              <tr key={order.id} className="border-t text-center">
                <td className="px-4 py-2">{order.medicineName}</td>
                <td className="px-4 py-2">{order.quantity}</td>
                 <td className="py-2 px-4 border">₹{order.price}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={() => handleReceive(order)}
                    disabled={!account || !contract}
                    title={!account ? "Connect your wallet" : !contract ? "Contract not loaded" : ""}
                  >
                    Receive
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

export default PatientRecieve;