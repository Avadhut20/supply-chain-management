import React, { useEffect, useState } from "react";
import axios from "axios";

const ManufacturerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("MANUFACTURE");
      const res = await axios.get("http://localhost:8080/manufacture/pending-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShip = async (orderItemId) => {
    try {
      const token = localStorage.getItem("MANUFACTURE");
      await axios.post(`http://localhost:8080/manufacture/ship/${orderItemId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Order marked as shipped");
      fetchOrders(); // Refresh orders
    } catch (err) {
      console.error("Failed to mark as shipped:", err);
      alert("Error shipping the order");
    }
  };

  useEffect(() => {
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
                  <td className="px-4 py-2">{order.dealerName}</td>
                  <td className="px-4 py-2">{order.hospitalName}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleShip(order.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Mark as Shipped
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
