import React, { useEffect, useState } from "react";
import axios from "axios";
import Web3 from "web3";
import MedicineTransactionManager from "../../../blockchain/build/contracts/MedicineTransactionManager.json";

const CONTRACT_ADDRESS = "0xB65CF62C53680759767D2f798f5D2436bdfaFEda";

const DealerReceiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  // Init web3 + contract
  const initWeb3 = async () => {
    if (window.ethereum) {
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
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("DEALER");
      const { data } = await axios.get("http://localhost:8080/dealer/receive-orders", {
        headers: { Authorization: token },
      });
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch dealer receive orders", error);
    }
  };

  const handleShipToPatient = async (order) => {
  try {
    const token = localStorage.getItem("DEALER");
    console.log("Shipping order:", order);
    console.log("Calling dealerDelivered with onChainOrderId:", order.onChainOrderId);

    if (!order.onChainOrderId) {
      alert("Order missing onChainOrderId. Cannot proceed.");
      return;
    }

    const orderId = Number(order.onChainOrderId); // ensure correct type

    const tx=await contract.methods.dealerDelivered(orderId).send({ from: account });
    console.log("Transaction successful:", tx);
    console.log("✅ Delivered to Dealer");

    // Update backend
    await axios.post(`http://localhost:8080/dealer/ship/${order.id}`, {}, {
      headers: { Authorization: token },
    });

    alert("✅ Order marked as delivered to patient.");
    fetchOrders();
  } catch (error) {
    console.error("❌ Error in shipping process", error);
    alert("Something went wrong during shipping.");
  }
};


  useEffect(() => {
    initWeb3();
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Orders to Ship to Patients</h2>
      {orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Patient Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Medicine</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t text-center">
                <td className="px-4 py-2">{order.patientName}</td>
                <td className="px-4 py-2">{order.patientEmail}</td>
                <td className="px-4 py-2">{order.medicineName}</td>
                <td className="px-4 py-2 border">₹{order.price}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() => handleShipToPatient(order)}
                  >
                    Ship to Patient
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

export default DealerReceiveOrders;
