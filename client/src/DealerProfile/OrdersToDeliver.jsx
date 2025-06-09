import React, { useEffect, useState } from "react";
import axios from "axios";

function DealerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders for dealer with token:", localStorage.getItem("DEALER"));
        const { data } = await axios.get("http://localhost:8080/dealer/pending-orders", {
          headers: { Authorization:  localStorage.getItem("DEALER") },
        });
        setOrders(data.orders);
        console.log("Orders fetched:", data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleBuy = async (orderItemId) => {
    try {
      console.log("Buying order item with ID:", orderItemId);
      await axios.post(
        `http://localhost:8080/dealer/buy/${orderItemId}`,
        {}, // No body content
        {
          headers: { Authorization: localStorage.getItem("DEALER") },
        }
      );

      setOrders((prev) => prev.filter((order) => order.id !== orderItemId));

      alert("Order item bought successfully!");
    } catch (error) {
      console.error("Error buying order item:", error);
      alert("Failed to buy the order item.");
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
               <th className="px-4 py-2 border">Price</th> {/* New column */}
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
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
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => handleBuy(order.id)}
                    >
                      Buy
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
