import React, { useEffect, useState } from "react";
import axios from "axios";

function DeliveredMedicines() {
  const [delivered, setDelivered] = useState([]);

  useEffect(() => {
    const fetchDelivered = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/dealer/delivered");
        setDelivered(data.delivered);
      } catch (error) {
        console.error("Error fetching delivered medicines:", error);
      }
    };
    fetchDelivered();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Delivered Medicines</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Patient Name</th>
              <th className="px-4 py-2 border">Medicine</th>
              <th className="px-4 py-2 border">Delivered On</th>
            </tr>
          </thead>
          <tbody>
            {delivered.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="px-4 py-2 border">{item.patientName}</td>
                <td className="px-4 py-2 border">{item.medicineName}</td>
                <td className="px-4 py-2 border">{new Date(item.deliveredAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeliveredMedicines;
