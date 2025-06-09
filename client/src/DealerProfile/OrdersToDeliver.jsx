import React, { useEffect, useState } from "react";
import axios from "axios";
import Web3 from "web3";
import contractABI from "../../../blockchain/build/contracts/MedicineTransactionManager.json";

const CONTRACT_ADDRESS = "0x60afD1cBd42ABEc160b6AE8D6999F38373eFD260";

function DealerOrders() {
  const [orders, setOrders] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  useEffect(() => {
    const initWeb3AndContract = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3Instance.eth.getAccounts();

          const contractInstance = new web3Instance.eth.Contract(
            contractABI.abi,
            CONTRACT_ADDRESS
          );

          setWeb3(web3Instance);
          setAccount(accounts[0]);
          setContract(contractInstance);
        } catch (error) {
          console.error("Web3 initialization failed:", error);
          alert("Failed to connect with MetaMask.");
        }
      } else {
        alert("MetaMask not detected. Please install MetaMask.");
      }
    };

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8080/dealer/pending-orders",
          {
            headers: { Authorization: localStorage.getItem("DEALER") },
          }
        );
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    initWeb3AndContract();
    fetchOrders();
  }, []);

  const handleBuy = async (order) => {
    try {
      if (!contract || !web3 || !account) {
        alert("Web3 or contract not initialized.");
        return;
      }

      setLoadingOrderId(order.id);

      const dealerAddress = localStorage.getItem("walletAddress_DEALER") || account;

      // Validate addresses and convert to checksum format
      const manufacturerAddr = web3.utils.toChecksumAddress(order.manufacturerWalletAddress);
      const hospitalAddr = web3.utils.toChecksumAddress(order.hospitalWalletAddress);
      const dealerAddr = web3.utils.toChecksumAddress(dealerAddress);

      console.log("📦 Order ID:", order.id);
      console.log("🏭 Manufacturer wallet from backend:", manufacturerAddr);
      console.log("🏥 Hospital wallet from backend:", hospitalAddr);
      console.log("🧾 Dealer wallet (localStorage):", dealerAddr);

      // Double check addresses
      if (
        !web3.utils.isAddress(manufacturerAddr) ||
        !web3.utils.isAddress(hospitalAddr) ||
        !web3.utils.isAddress(dealerAddr)
      ) {
        alert("❌ One or more wallet addresses are invalid.");
        setLoadingOrderId(null);
        return;
      }

      const INR_TO_ETH = 0.000034;
      const priceInEth = order.price * INR_TO_ETH;
      const priceInWei = web3.utils.toWei(priceInEth.toString(), "ether");

      console.log("🪙 Price in Wei:", priceInWei);

      const tx = await contract.methods
        .createOrder(
          manufacturerAddr,
          hospitalAddr,
          dealerAddr,
          priceInWei,  // hospital share (in wei)
          "0"          // dealer share, for now 0
        )
        .send({ from: dealerAddr, value: priceInWei });

      console.log("✅ Transaction receipt:", tx);

      const event = tx.events?.OrderCreated || tx.events?.MedicineOrdered;
      if (!event) {
        alert("❌ OrderCreated or MedicineOrdered event not found in transaction receipt.");
        setLoadingOrderId(null);
        return;
      }

      const onChainOrderIdRaw = event.returnValues?.orderId;
      const onChainOrderId = onChainOrderIdRaw?.toString();

      console.log("🆔 onChainOrderId:", onChainOrderId);
      console.log("🏭 Manufacturer stored on-chain:", event.returnValues.manufacturer || event.returnValues.patient);

      await axios.post(
        `http://localhost:8080/dealer/buy/${order.id}`,
        { onChainOrderId },
        { headers: { Authorization: localStorage.getItem("DEALER") } }
      );

      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      alert("✅ Order bought successfully!");
    } catch (error) {
      console.error("❌ Failed to buy order:", error);
      alert(`Failed to buy order: ${error.message || error}`);
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Requested Items to Buy</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Patient Name</th>
              <th className="px-4 py-2 border">Medicine</th>
              <th className="px-4 py-2 border">Hospital</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Price (INR)</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No orders to buy.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="text-center">
                  <td className="px-4 py-2 border">{order.patientName}</td>
                  <td className="px-4 py-2 border">{order.medicineName}</td>
                  <td className="px-4 py-2 border">{order.hospitalName}</td>
                  <td className="px-4 py-2 border">{order.quantity}</td>
                  <td className="px-4 py-2 border">₹{order.price}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      onClick={() => handleBuy(order)}
                      disabled={loadingOrderId === order.id}
                    >
                      {loadingOrderId === order.id ? "Buying..." : "Buy"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DealerOrders;
