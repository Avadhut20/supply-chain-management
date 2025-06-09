import React, { useEffect, useState } from "react";
import axios from "axios";

const DealerReceiveOrders = () => {
  const [orders, setOrders] = useState([]);

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

  const handleShipToPatient = async (orderItemId) => {
    try {
      const token = localStorage.getItem("DEALER");
      await axios.post(`http://localhost:8080/dealer/ship/${orderItemId}`, {}, {
        headers: { Authorization: token },
      });
      alert("Order shipped to patient");
      fetchOrders(); // Refresh
    } catch (error) {
      console.error("Failed to ship to patient", error);
      alert("Error shipping to patient");
    }
  };

  useEffect(() => {
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
                    onClick={() => handleShipToPatient(order.id)}
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
