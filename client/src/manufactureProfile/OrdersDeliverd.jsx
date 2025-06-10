import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersDeliverd = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShippedOrders = async () => {
    try {
      const token = localStorage.getItem("MANUFACTURE");

      const response = await axios.get("http://localhost:8080/manufacture/shipped", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching shipped orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippedOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Orders Shipped to Dealer</h2>

      {loading ? (
        <p className="text-gray-500">Loading shipped orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No shipped orders available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white rounded shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border text-left">Order ID</th>
                <th className="px-4 py-2 border text-left">Patient</th>
                <th className="px-4 py-2 border text-left">Medicine</th>
                <th className="px-4 py-2 border text-left">Quantity</th>
                <th className="px-4 py-2 border text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border">{order.id}</td>
                  <td className="px-4 py-2 border">{order.patientName || "Unknown"}</td>
                  <td className="px-4 py-2 border">{order.medicineName}</td>
                  <td className="px-4 py-2 border">{order.quantity}</td>
                  <td className="px-4 py-2 border text-green-600 font-semibold">
                    Shipped to Dealer
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

export default OrdersDeliverd;
