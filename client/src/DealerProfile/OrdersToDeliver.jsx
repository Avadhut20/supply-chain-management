import React, { useEffect, useState } from "react";
import axios from "axios";

function OrdersToDeliver() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/dealer/pending-orders");
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const markAsDelivered = async (orderId) => {
    try {
      await axios.post(`http://localhost:8080/dealer/deliver/${orderId}`);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Error marking order as delivered:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Orders to Deliver</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Patient Name</th>
              <th className="px-4 py-2 border">Medicine</th>
              <th className="px-4 py-2 border">Hospital</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-center">
                <td className="px-4 py-2 border">{order.patientName}</td>
                <td className="px-4 py-2 border">{order.medicineName}</td>
                <td className="px-4 py-2 border">{order.hospitalName}</td>
                <td className="px-4 py-2 border">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => markAsDelivered(order.id)}
                  >
                    Mark Delivered
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersToDeliver;
