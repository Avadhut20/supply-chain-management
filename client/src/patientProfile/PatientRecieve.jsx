import React, { useEffect, useState } from "react";
import axios from "axios";

const PatientRecieve = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("PATIENT");
      const { data } = await axios.get("http://localhost:8080/patient/receive-orders", {
        headers: { Authorization: token },
      });
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch patient receive orders", error);
    }
  };

  const handleReceive = async (orderItemId) => {
    try {
      const token = localStorage.getItem("PATIENT");
      await axios.post(`http://localhost:8080/patient/receive/${orderItemId}`, {}, {
        headers: { Authorization: token },
      });
      alert("Order marked as received!");
      fetchOrders();
    } catch (error) {
      console.error("Failed to mark as received", error);
      alert("Error marking as received");
    }
  };

  useEffect(() => {
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
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t text-center">
                <td className="px-4 py-2">{order.medicineName}</td>
                <td className="px-4 py-2">{order.quantity}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => handleReceive(order.id)}
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
}

export default PatientRecieve