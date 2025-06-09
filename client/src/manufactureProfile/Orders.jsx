import React, { useEffect, useState } from "react";
import Web3 from "web3";
import axios from "axios";
import MedicineTransactionManager from "../../../blockchain/build/contracts/MedicineTransactionManager.json";

const CONTRACT_ADDRESS = "0x4A8EFB4754C2fC12BBDa0450261277502305C78B";

const ManufacturerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [loadingShipId, setLoadingShipId] = useState(null);

  // Initialize Web3, contract, and MetaMask account
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
        setAccount(accounts[0]);
        setContract(contractInstance);
        console.log("✅ Connected MetaMask account:", accounts[0]);
      } catch (err) {
        alert("MetaMask authorization failed or cancelled.");
        console.error("MetaMask error:", err);
      }
    } else {
      alert("MetaMask is not installed. Please install it to continue.");
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("MANUFACTURE");
      const res = await axios.get(
        "http://localhost:8080/manufacture/pending-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle marking order as shipped on-chain
const handleShip = async (order) => {
  if (!web3 || !contract || !account) {
    alert("Web3 or account not initialized.");
    return;
  }

  if (!order.onChainOrderId && order.onChainOrderId !== 0) {
    alert("Missing on-chain order ID.");
    return;
  }

  try {
    setLoadingShipId(order.id);
    console.log("🧾 Fetching on-chain order with ID:", order.onChainOrderId);

    const onChainOrder = await contract.methods.orders(order.onChainOrderId).call();
    const onChainManufacturer = onChainOrder.manufacturer.toLowerCase();
    const userAccount = account.toLowerCase();
    console.log("On-chain order details:", onChainOrder);
    if (onChainManufacturer !== userAccount) {
      alert("You are not the manufacturer for this order.");
      setLoadingShipId(null);
      return;
    }

    const orderStatus = Number(onChainOrder.status);
    if (orderStatus !== 1) {
      alert("Order is not in a state to be shipped (must be DealerPurchased).");
      setLoadingShipId(null);
      return;
    }

    // 🔗 Call smart contract function
    const tx=await contract.methods.manufacturerShipped(order.onChainOrderId).send({ from: account });
    console.log("✅ Transaction successful:", tx);
    // ✅ Update backend DB
    await axios.post(
      `http://localhost:8080/manufacture/ship/${order.id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("MANUFACTURE")}`,
        },
      }
    );

    alert("✅ Marked as shipped on blockchain and backend.");
    await fetchOrders();
  } catch (err) {
    console.error("❌ Failed to mark as shipped:", err);
    alert("Transaction or server error.");
  } finally {
    setLoadingShipId(null);
  }
};


  useEffect(() => {
    initWeb3();
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Pending Orders for Manufacturing</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">No pending orders.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Order ID</th>
                <th className="text-left px-4 py-2">Medicine</th>
                <th className="text-left px-4 py-2">Quantity</th>
                <th className="text-left px-4 py-2">Dealer</th>
                <th className="text-left px-4 py-2">Hospital</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{order.medicineName}</td>
                  <td className="px-4 py-2">{order.quantity}</td>
                  <td className="px-4 py-2">{order.dealerName || "N/A"}</td>
                  <td className="px-4 py-2">{order.hospitalName}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleShip(order)}
                      disabled={loadingShipId === order.id}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                      {loadingShipId === order.id ? "Shipping..." : "Mark as Shipped"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManufacturerOrders;
