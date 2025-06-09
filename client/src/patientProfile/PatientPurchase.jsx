import React, { useEffect, useState } from "react";
import axios from "axios";

const PatientPurchase = () => {
  const [orders, setOrders] = useState([]);

  const fetchPurchaseHistory = async () => {
    try {
      const token = localStorage.getItem("PATIENT");
      const { data } = await axios.get("http://localhost:8080/patient/purchase-history", {
        headers: { Authorization: token },
      });
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching purchase history", error);
    }
  };

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Purchase History</h2>
      {orders.length === 0 ? (
        <p>No purchases yet.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Medicine Name</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Dealer</th>
              <th className="px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t text-center">
                <td className="px-4 py-2">{order.medicineName}</td>
                <td className="px-4 py-2">{order.quantity}</td>
                <td className="px-4 py-2">{order.dealerName}</td>
                <td className="px-4 py-2">{new Date(order.deliveredAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientPurchase;
