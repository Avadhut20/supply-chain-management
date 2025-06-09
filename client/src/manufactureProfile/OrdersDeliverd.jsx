import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersDeliverd = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchShippedOrders();
  }, []);

  const fetchShippedOrders = async () => {
    try {
      const token = localStorage.getItem("MANUFACTURER");
     const response = await axios.get("http://localhost:8080/manufacturer/shipped", {
  headers: { Authorization: `Bearer ${token}` },
});


      // ✅ Set the extracted array or fallback to empty
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching shipped orders", error);
      setOrders([]);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Orders Shipped to Dealer</h2>

      {!Array.isArray(orders) || orders.length === 0 ? (
        <p>No shipped orders available.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">Patient</th>
              <th className="px-4 py-2 border">Medicine</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t text-center">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.patientName || "Unknown"}</td>
                <td className="px-4 py-2">{order.medicineName}</td>
                <td className="px-4 py-2">{order.quantity}</td>
                <td className="px-4 py-2">Shipped to Dealer</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersDeliverd;
